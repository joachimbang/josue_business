import { getUserFromRequest } from '@/lib/auth';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req) {
  const user = await getUserFromRequest(req);
  console.log("🔍 Utilisateur récupéré:", user);

  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Non autorisé' }, { status: 403 });
  }

  const { name, managerId } = await req.json();

  if (!name) {
    return NextResponse.json({ message: 'Le nom du business est requis' }, { status: 400 });
  }

  // ✅ Crée la boutique
  const business = await prisma.business.create({
    data: {
      name,
      adminId: user.userId,
      managerId: managerId || null,
    },
  });

  // ✅ Si un manager a été attribué, on le vérifie automatiquement
  if (managerId) {
    await prisma.user.update({
      where: { id: managerId },
      data: { verified: true },
    });
  }

  return NextResponse.json({ message: 'Business créé', business });
}
