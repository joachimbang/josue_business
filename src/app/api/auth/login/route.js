import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { signToken } from '@/lib/jwt';

export async function POST(req) {
  try {
    const { email, password } = await req.json(); // ✅ Tu dois extraire les données

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        managedBusinesses: true,   // pour les GERANT
        adminBusinesses: true,     // pour les ADMIN
      },
    });

    if (!user) {
      return NextResponse.json({ message: 'Email incorrect' }, { status: 400 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ message: 'Mot de passe incorrect' }, { status: 400 });
    }

    const token = signToken({ userId: user.id, role: user.role });

    // ✅ Construire dynamiquement la réponse utilisateur selon le rôle
    const userPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    if (user.role === "GERANT") {
      userPayload.businessId = user.managedBusinesses?.id || null;
    }

    if (user.role === "ADMIN") {
      userPayload.businesses = user.adminBusinesses.map(b => ({
        id: b.id,
        name: b.name
      }));
    }

    const response = NextResponse.json({
      message: 'Connexion réussie',
      token,
      user: userPayload,
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      // sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;

  } catch (err) {
    console.error('Erreur lors de la connexion :', err);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
