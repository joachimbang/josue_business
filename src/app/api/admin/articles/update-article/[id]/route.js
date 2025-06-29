import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

// PATCH ou PUT : mise à jour d'un article
export async function PATCH(req, { params }) {
  try {
    const user = await getUserFromRequest(req);

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Accès refusé' }, { status: 403 });
    }

    const productId = params.id;
    const data = await req.json(); // Contient les champs à mettre à jour

    // Vérifie si le produit existe et appartient à l'admin
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        business: true,
      },
    });

    if (!product) {
      return NextResponse.json({ message: 'Produit introuvable' }, { status: 404 });
    }

    if (product.business.adminId !== user.userId) {
      return NextResponse.json({ message: 'Ce produit ne vous appartient pas' }, { status: 403 });
    }

    // Mise à jour du produit
    const updated = await prisma.product.update({
      where: { id: productId },
      data,
    });

    return NextResponse.json({ message: 'Produit mis à jour avec succès', product: updated });

  } catch (error) {
    console.error('❌ Erreur mise à jour article :', error);
    return NextResponse.json({ message: 'Erreur interne du serveur' }, { status: 500 });
  }
}
