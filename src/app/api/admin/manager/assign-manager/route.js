import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

// export const config = { runtime: 'nodejs' };

export async function POST(req) {
  const user = await getUserFromRequest(req);
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Non autorisé' }, { status: 403 });
  }

  const { businessId, managerId } = await req.json();

  const business = await prisma.business.update({
    where: { id: businessId },
    data: {
      manager: {
        connect: { id: managerId },
      },
    },
  });

  return NextResponse.json({ message: 'Manager assigné au business.', business });
}
