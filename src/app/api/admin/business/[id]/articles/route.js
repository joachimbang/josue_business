import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req, { params }) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ message: 'Non authentifié.' }, { status: 401 });
    }

    const businessId = params?.id;
    if (!businessId) {
      return NextResponse.json({ message: 'ID business manquant.' }, { status: 400 });
    }

    // Vérifie si le business existe
    const business = await prisma.business.findUnique({
      where: { id: businessId },
      select: {
        id: true,
        adminId: true,
        managerId: true,
      },
    });

    if (!business) {
      return NextResponse.json({ message: 'Business introuvable.' }, { status: 404 });
    }

    // Autoriser uniquement l'admin ou le gérant de ce business
    const isAdmin = user.role === 'ADMIN' && business.adminId === user.userId;
    const isGerant = user.role === 'GERANT' && business.managerId === user.userId;

    if (!isAdmin && !isGerant) {
      return NextResponse.json({ message: 'Accès refusé.' }, { status: 403 });
    }

    // Récupère les produits associés à ce business
    const articles = await prisma.product.findMany({
      where: { businessId },
      select: {
        id: true,
        name: true,
        price: true,
        description: true,
      },
    });

    return NextResponse.json({ articles });
  } catch (error) {
    console.error('Erreur GET articles par business:', error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
