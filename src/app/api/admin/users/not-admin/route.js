import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const config = { runtime: 'nodejs' };

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: {
          not: 'ADMIN', // Exclure les administrateurs
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        verified: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        managedBusinesses: {
          select: {
            id: true,
            name: true,
          },
        },
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
