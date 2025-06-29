import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req) {
  try {
    // 🔐 Vérifie l'authentification
    const user = await getUserFromRequest(req);

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Accès refusé' }, { status: 403 });
    }

    // 📅 Récupère les paramètres d'URL (filtrage par dates)
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate'); // Format: 2025-06-01
    const endDate = searchParams.get('endDate');     // Format: 2025-06-30

    // 🔎 Récupère les ventes des boutiques gérées par cet admin
    const sales = await prisma.sale.findMany({
      where: {
        business: {
          adminId: user.userId,
        },
        date: {
          gte: startDate ? new Date(startDate) : undefined,
          lte: endDate ? new Date(endDate) : undefined,
        },
      },
      include: {
        business: true, // pour savoir à quelle boutique appartient la vente
        details: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    // 📦 Formate les données
    const formatted = sales.map(sale => {
      const total = sale.details.reduce((sum, d) => sum + d.totalPrice, 0);
      return {
        saleId: sale.id,
        date: sale.date,
        businessName: sale.business.name,
        total,
        items: sale.details.map(d => ({
          productName: d.product.name,
          quantity: d.quantity,
          unitPrice: d.product.price,
          totalPrice: d.totalPrice,
        })),
      };
    });

    return NextResponse.json({ sales: formatted });

  } catch (error) {
    console.error('❌ Erreur récupération historique ventes admin :', error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
