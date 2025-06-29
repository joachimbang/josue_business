import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function PATCH(req) {
  try {
    const user = await getUserFromRequest(req);

    if (!user) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
    }

    const { name, password, email } = await req.json();
    const dataToUpdate = {};

    // ✅ Nom modifiable par tous
    if (name) {
      dataToUpdate.name = name;
    }

    // ✅ Mot de passe à hasher avant stockage
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      dataToUpdate.password = hashedPassword;
    }

    // ✅ Email : réservé à l'admin
    if (email) {
      if (user.role !== 'ADMIN') {
        return NextResponse.json(
          { message: 'Seul un admin peut modifier son email.' },
          { status: 403 }
        );
      }
      dataToUpdate.email = email;
    }

    // 🔄 Mise à jour de l'utilisateur et récupération du résultat
    const updatedUser = await prisma.user.update({
      where: { id: user.userId },
      data: dataToUpdate,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      }, // Ne retourne pas le mot de passe
    });

    return NextResponse.json({
      message: 'Profil mis à jour avec succès.',
      user: updatedUser,
    });

  } catch (error) {
    console.error('❌ Erreur mise à jour profil :', error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
