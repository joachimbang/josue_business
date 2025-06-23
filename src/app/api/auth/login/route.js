import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { signToken } from '@/lib/jwt';

export async function POST(req) {
  const { email, password } = await req.json();
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) return NextResponse.json({ message: 'Email incorrect' }, { status: 400 });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return NextResponse.json({ message: 'Mot de passe incorrect' }, { status: 400 });

  const token = signToken({ userId: user.id, role: user.role });

  return NextResponse.json({
    message: 'Connexion réussie',
    token,
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  });
}
