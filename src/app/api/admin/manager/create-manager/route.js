// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import bcrypt from "bcryptjs";
// import { getUserFromRequest } from "@/lib/auth";
// import transporter from "@/config/nodemailer";

// export const config = {
//   runtime: "nodejs",
// };

// export async function POST(req) {
//   const user = await getUserFromRequest(req);

//   if (!user || user.role !== "ADMIN") {
//     return NextResponse.json({ message: "Non autorisé" }, { status: 403 });
//   }

//   const { email, businessId,name } = await req.json();
//   const password = Math.floor(10000000 + Math.random() * 90000000).toString(); // Code à 6 chiffres
//   console.log(" password :", password);

//   if (!email || !password || !businessId) {
//     return NextResponse.json(
//       { message: "Champs requis manquants." },
//       { status: 400 }
//     );
//   }

//   const hashedPassword = await bcrypt.hash(password, 10);

//   try {
//     const newManager = await prisma.user.create({
//       data: {
//         email,
//         name,
//         password: hashedPassword,
//         role: "GERANT",
//         managedBusinesses: {
//           connect: { id: "acda3d78-c01a-4081-878b-fe9ec3781a21" },
//         },
//       },
//     });

//     const mailOption = {
//       from: "joachimbangirahe.jb@gmail.com",
//       to: user.email,
//       subject: "Password Reset OTP",
//       text: `Votre mot de passe par default est : ${password}. `,
//       html: `<p>Voici votre mot de passe par default : <strong>${password}</strong></p>`,
//     };

//     await transporter.sendMail(mailOption);

//     return NextResponse.json({
//       message: "Gérant créé et assigné.",
//       manager: newManager,
//     });
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json(
//       { message: "Erreur lors de la création." },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import transporter from '@/config/nodemailer';

// export const config = { runtime: 'nodejs' };

export async function POST(req) {
  const { email,name } = await req.json();
  const password = Math.floor(10000000 + Math.random() * 90000000).toString(); // password à 8 chiffres
  console.log(" password :", password);

  if (!email || !name) {
    return NextResponse.json({ message: 'Email et le nom sont requis.' }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ message: 'Utilisateur déjà existant.' }, { status: 400 });
  }

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
      subject: "Password Reset OTP",
      text: `Votre mot de passe par default est : ${password}. `,
      html: `<p>Voici votre mot de passe par default : <strong>${password}</strong></p>`,
    };

    await transporter.sendMail(mailOption);

  return NextResponse.json({ message: 'Gérant créé.', manager });
}
