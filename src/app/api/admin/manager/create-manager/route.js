import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import transporter from '@/config/nodemailer';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(req) {
  const tokenPayload = await getUserFromRequest(req);
  const { email, name } = await req.json();
  const password = Math.floor(10000000 + Math.random() * 90000000).toString(); // 8 chiffres

  console.log("🔐 Password :", password);
  console.log("📧 Envoi à :", email);

  if (!tokenPayload) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  if (!email || !name) {
    return NextResponse.json({ message: 'Email et le nom sont requis.' }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ message: 'Utilisateur déjà existant.' }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const manager = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      role: 'GERANT',
    },
  });

  const mailOption = {
    from: "joachimbangirahe.jb@gmail.com",
    to: email,
    subject: "Mot de passe par défaut",
    text: `Votre mot de passe est : ${password}`,
    html: `<p>Voici votre mot de passe : <strong>${password}</strong></p>`,
  };

  try {
    await transporter.sendMail(mailOption);
    console.log("✅ Email envoyé !");
  } catch (err) {
    console.error("❌ Erreur lors de l’envoi de l’email :", err);
    return NextResponse.json({ message: "Erreur lors de l’envoi du mail." }, { status: 500 });
  }

  return NextResponse.json({ message: 'Gérant créé.', manager });
}
