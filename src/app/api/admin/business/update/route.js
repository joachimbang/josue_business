import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function PUT(req) {
  const user = await getUserFromRequest(req);

  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Non autorisé' }, { status: 403 });
  }

  const { id, name, managerId } = await req.json();

  // if (!id || !name) {
  //   return NextResponse.json({ message: 'ID et nom du business requis' }, { status: 400 });
  // }

  try {
    const updated = await prisma.business.update({
      where: { id },
      data: {
        name,
        managerId: managerId ,
      },
    });

    // 2. Mettre à jour son statut (verify: true)
    await prisma.user.update({
      where: { id: managerId },
      data: {
        verified: true,
      },
    });

    return NextResponse.json({ message: 'Business mis à jour', business: updated });
  } catch (error) {
    return NextResponse.json({ message: 'Erreur lors de la mise à jour', error: error.message }, { status: 500 });
  }
}
