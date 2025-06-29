import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req) {
  try {
    // Récupère l'utilisateur connecté à partir du token dans la requête
    const user = await getUserFromRequest(req);

    // Vérifie que l'utilisateur est bien authentifié
    if (!user || !user.userId) {
      return NextResponse.json({
        message: "Utilisateur non authentifié",
        totalVendu: 0,
        articleCount: 0,
      }, { status: 401 });
    }

    // Recherche le business associé au gérant connecté (managerId = userId)
    const business = await prisma.business.findFirst({
      where: { managerId: user.userId }, // Utilise user.userId (pas user.id)
    });

    // Si aucun business trouvé, on renvoie un message et des valeurs à zéro
    if (!business) {
      return NextResponse.json({
        message: "Aucun business trouvé pour ce gérant",
        totalVendu: 0,
        articleCount: 0,
      });
    }

    // Agrégation pour calculer la somme totale des ventes (totalPrice)
    // sur toutes les entrées saleDetail liées au business
    const totalVenduResult = await prisma.saleDetail.aggregate({
      where: {
        sale: {
          businessId: business.id, // Filtre par business ID
        },
      },
      _sum: {
        totalPrice: true, // Somme du champ totalPrice
      },
    });

    // Compte le nombre total de produits liés à ce business
    const articleCount = await prisma.product.count({
      where: {
        businessId: business.id,
      },
    });

    // Renvoie la réponse JSON avec le total vendu et le nombre d'articles
    return NextResponse.json({
      totalVendu: totalVenduResult._sum.totalPrice ?? 0, // Si null, 0 par défaut
      articleCount,
    });
  } catch (err) {
    // En cas d'erreur, affiche dans la console et renvoie un message 500
    console.error("Erreur dashboard gérant :", err);
    return NextResponse.json(
      { message: 'Erreur interne' },
      { status: 500 }
    );
  }
}
