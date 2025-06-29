import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(req) {
  try {
    const user = await getUserFromRequest(req);

    if (!user) {
      return NextResponse.json({ message: 'Utilisateur non authentifié.' }, { status: 401 });
    }

    // Utilise user.userId car dans ton token c'est userId
    console.log("ID du gérant:", user.userId, "Role:", user.role);

    if (user.role !== 'GERANT') {
      return NextResponse.json({ message: 'Accès refusé.' }, { status: 403 });
    }

    // Recherche tous les business liés au gérant (pas findFirst)
    const businesses = await prisma.business.findMany({
      where: { managerId: user.userId },
    });

    if (!businesses || businesses.length === 0) {
      return NextResponse.json({ message: 'Aucun business trouvé pour ce gérant.' }, { status: 404 });
    }

    // Si plusieurs business trouvés, prends le premier (ou adapte ta logique)
    const business = businesses[0];
    console.log("Business trouvé:", business);

    const { items } = await req.json(); // [{ productId, quantity }]

    // Crée la vente du jour
    const sale = await prisma.sale.create({
      data: {
        businessId: business.id,
        date: new Date(),
      },
    });

    let totalJour = 0;

    // Ajoute chaque produit vendu
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        console.log(`Produit introuvable: ${item.productId}`);
        continue;
      }

      const totalPrice = product.price * item.quantity;
      totalJour += totalPrice;

      await prisma.saleDetail.create({
        data: {
          saleId: sale.id,
          productId: product.id,
          quantity: item.quantity,
          totalPrice,
        },
      });

      console.log(`Produit: ${product.name}, Qté: ${item.quantity}, Total: ${totalPrice}`);
    }

    console.log(`✅ Total vendu du jour: ${totalJour}`);

    return NextResponse.json({
      message: 'Ventes enregistrées.',
      totalJour,
    });

  } catch (error) {
    console.error('❌ Erreur enregistrement vente :', error);
    return NextResponse.json({ message: 'Erreur interne du serveur.' }, { status: 500 });
  }
}
