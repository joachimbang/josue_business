import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { signToken } from '@/lib/jwt';

// API Route: /api/login
export async function POST(req) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ message: 'Email incorrect' }, { status: 400 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ message: 'Mot de passe incorrect' }, { status: 400 });
    }

    // ✅ Génération du token
    const token = signToken({ userId: user.id, role: user.role });

    // ✅ Réponse avec cookie
    const response = NextResponse.json({
      message: 'Connexion réussie',
      token, // facultatif, utile si tu veux le voir dans Postman ou l’utiliser manuellement
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

    // ✅ Définir le cookie token
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // en prod, exige HTTPS
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 jours
      path: '/',
    });

    return response;
  } catch (err) {
    console.error('Erreur lors de la connexion :', err);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
