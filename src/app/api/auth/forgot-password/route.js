// src/app/api/auth/forgot-password/route.js

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import transporter from '@/config/nodemailer';

export async function POST(req) {
  const { email } = await req.json();
  console.log("🔍 Email reçu pour réinitialisation :", email);

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return NextResponse.json({ message: 'Aucun utilisateur trouvé' }, { status: 404 });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Code à 6 chiffres
  const otpExpires = new Date(Date.now() + 1000 * 60 * 10); // 10 min

  await prisma.user.update({
    where: { email },
    data: {
      otp,
      otpExpires,
    },
  });

  const mailOption = {
      from: "joachimbangirahe.jb@gmail.com",
      to: user.email,
      subject: "Password Reset OTP",
      text: `Your OTP for resetting your password is: ${otp}. 
      Use this otp proceed with resetting your password.`,
      html: `<p>Voici votre code de réinitialisation : <strong>${otp}</strong></p>`
    };

    await transporter.sendMail(mailOption);

  console.log(`🔐 Code de réinitialisation OTP pour ${email} : ${otp}`);

  return NextResponse.json({ message: 'Code envoyé. Vérifiez votre email.' });
}
