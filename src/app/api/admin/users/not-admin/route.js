import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const config = { runtime: 'nodejs' };

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: {
          not: 'ADMIN', // Exclut les ADMIN
        },
      },
      orderBy: {
        createdAt: 'desc', // Optionnel : trie les plus récents en premier
      },
      select: {
        // Sélectionne uniquement les champs nécessaires
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ users });
  } catch (err) {
    console.error('Erreur récupération utilisateurs :', err);
    return NextResponse.json(
      { message: 'Erreur lors de la récupération.' },
      { status: 500 }
    );
  }
}
