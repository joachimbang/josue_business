import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req) {
  try {
    const user = await getUserFromRequest(req);

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ message: "Accès refusé" }, { status: 403 });
    }

    // Récupère tous les gérants sans business assigné
    const users = await prisma.user.findMany({
      where: {
        role: "GERANT",
        verified:false,
        // managedBusinesses: {
        // //   none: {}, // Aucun business géré
        // },
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Erreur récupération gérants inactifs:", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
