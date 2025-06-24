import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const config = { runtime: 'nodejs' };

export async function GET() {
  try {
    const businesses = await prisma.business.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        admin: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        manager: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ businesses });
  } catch (err) {
    console.error('Erreur récupération businesses :', err);
    return NextResponse.json(
      { message: 'Erreur lors de la récupération des businesses.' },
      { status: 500 }
    );
  }
}
