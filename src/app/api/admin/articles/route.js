// src/app/api/admin/articles/route.js

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(req) {
  try {
    const user = await getUserFromRequest(req);

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 403 });
    }

    const { articles, businessId } = await req.json();

    if (!Array.isArray(articles) || !businessId) {
      return NextResponse.json({ message: 'Données invalides' }, { status: 400 });
    }

    // ✅ Enregistrer les articles
    const created = await Promise.all(
      articles.map((article) =>
        prisma.product.create({
          data: {
            name: article.nom,
            price: parseFloat(article.prix),
            description: article.description,
            businessId,
          },
        })
      )
    );

    return NextResponse.json({
      message: 'Articles ajoutés avec succès',
      produits: created,
    });
  } catch (err) {
    console.error('❌ Erreur API articles :', err);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
