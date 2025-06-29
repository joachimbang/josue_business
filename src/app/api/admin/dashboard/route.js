import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req) {
  try {
    // 🔐 Récupère l'admin connecté depuis le token
    const user = await getUserFromRequest(req);

    // 🛑 Vérifie que c'est un admin
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Accès refusé' }, { status: 403 });
    }

    // 🔍 Récupère toutes les boutiques créées par cet admin
    const businesses = await prisma.business.findMany({
      where: {
        adminId: user.userId, // <- Assure-toi que le champ dans le token est bien userId
      },
      include: {
        manager: true, // Récupère aussi les infos du gérant (relation avec User)
      },
    });

    // 📊 Prépare les données pour chaque boutique
    const result = [];

    for (const business of businesses) {
      // 🔁 Calcule le revenu total de cette boutique
      const totalRevenue = await prisma.saleDetail.aggregate({
        where: {
          sale: {
            businessId: business.id,
          },
        },
        _sum: {
          totalPrice: true,
        },
      });

      result.push({
        businessId: business.id,
        businessName: business.name,
        managerName: business.manager ? business.manager.name : 'Non assigné',
        revenue: totalRevenue._sum.totalPrice || 0,
      });
    }

    return NextResponse.json({ businesses: result });
  } catch (error) {
    console.error('❌ Erreur dashboard admin :', error);
    return NextResponse.json({ message: 'Erreur interne du serveur' }, { status: 500 });
  }
}
