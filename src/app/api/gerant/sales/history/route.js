import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req) {
  try {
    const user = await getUserFromRequest(req);
    console.log("User reçu:", user);

    if (!user || user.role !== 'GERANT') {
      return NextResponse.json({ message: 'Accès refusé' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate'); // ex: '2025-06-01'
    const endDate = searchParams.get('endDate');     // ex: '2025-06-24'
    console.log("StartDate:", startDate, "EndDate:", endDate);

    // Recherche du business lié au gérant (avec user.userId)
    const business = await prisma.business.findFirst({
      where: { managerId: user.userId },
    });
    console.log("Business trouvé:", business);

    if (!business) {
      return NextResponse.json({ message: 'Aucun business associé' }, { status: 404 });
    }

    // Construction dynamique du filtre date
    const dateFilter = {};
    if (startDate) dateFilter.gte = new Date(startDate);
    if (endDate) dateFilter.lte = new Date(endDate);

    const sales = await prisma.sale.findMany({
      where: {
        businessId: business.id,
        ...(startDate || endDate ? { date: dateFilter } : {}),
      },
      orderBy: { date: 'desc' },
      include: {
        details: {
          include: { product: true },
        },
      },
    });

    console.log("Ventes trouvées:", sales.length);

    const formattedSales = sales.map((sale) => {
      const total = sale.details.reduce((sum, detail) => sum + detail.totalPrice, 0);
      return {
        saleId: sale.id,
        date: sale.date,
        total,
        items: sale.details.map((detail) => ({
          productName: detail.product.name,
          quantity: detail.quantity,
          unitPrice: detail.product.price,
          totalPrice: detail.totalPrice,
        })),
      };
    });

    return NextResponse.json({ sales: formattedSales });

  } catch (err) {
    console.error('Erreur historique ventes :', err);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
