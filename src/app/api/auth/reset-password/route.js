// src/app/api/auth/reset-password/route.js

import { hash } from 'bcryptjs'; 
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req) {
  const { email, otp, newPassword } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || user.otp !== otp || new Date(user.otpExpires) < new Date()) {
    return NextResponse.json({ message: 'Code invalide ou expiré' }, { status: 400 });
  }

  const hashedPassword = await hash(newPassword, 10);

  await prisma.user.update({
    where: { email },
    data: {
      password: hashedPassword,
      otp: null,
      otpExpires: null,
    },
  });

  return NextResponse.json({ message: 'Mot de passe réinitialisé avec succès' });
}
