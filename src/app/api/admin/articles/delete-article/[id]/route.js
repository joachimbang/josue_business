import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function DELETE(req, { params }) {
  try {
    const user = await getUserFromRequest(req);

    // 🔐 Vérifie que c'est un admin
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Accès refusé' }, { status: 403 });
    }

    const productId = params.id;

    // 🔍 Récupère le produit avec le business associé
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        business: true,
      },
    });

    if (!product) {
      return NextResponse.json({ message: 'Produit introuvable' }, { status: 404 });
    }

    // 🔐 Vérifie que le business du produit appartient à l’admin connecté
    if (product.business.adminId !== user.userId) {
      return NextResponse.json({ message: 'Ce produit ne vous appartient pas' }, { status: 403 });
    }

    // ❌ Supprime le produit
    await prisma.product.delete({
      where: { id: productId },
    });

    return NextResponse.json({ message: 'Produit supprimé avec succès' });
  } catch (error) {
    console.error('❌ Erreur suppression article :', error);
    return NextResponse.json({ message: 'Erreur interne du serveur' }, { status: 500 });
  }
}
