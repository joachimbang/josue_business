import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(req) {
  const user = await getUserFromRequest(req);

  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Non autorisé' }, { status: 403 });
  }

  const { businessId, managerId } = await req.json();

  try {
    // 1. Assigner le manager à la boutique
    const business = await prisma.business.update({
      where: { id: businessId },
      data: {
        manager: {
          connect: { id: managerId },
        },
      },
    });

    // 2. Mettre à jour son statut (verify: true)
    await prisma.user.update({
      where: { id: managerId },
      data: {
        verified: true,
      },
    });

    return NextResponse.json({
      message: 'Manager assigné au business et vérifié.',
      business,
    });
  } catch (err) {
    console.error('Erreur assignation gérant :', err);
    return NextResponse.json(
      { message: 'Erreur lors de l’assignation.' },
      { status: 500 }
    );
  }
}
