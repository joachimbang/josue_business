import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

// 🔄 MODIFIER un utilisateur
export async function PUT(req, { params }) {
  const admin = await getUserFromRequest(req);
  const { id } = params;

  if (!admin || admin.role !== "ADMIN") {
    return NextResponse.json({ message: "Non autorisé." }, { status: 403 });
  }

  const { name, email } = await req.json();

  if (!name || !email) {
    return NextResponse.json({ message: "Nom et email requis." }, { status: 400 });
  }

  try {
    const existing = await prisma.user.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json({ message: "Utilisateur introuvable." }, { status: 404 });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { name, email },
    });

    return NextResponse.json({ message: "Utilisateur modifié avec succès.", user: updatedUser });
  } catch (error) {
    console.error("Erreur modification :", error);
    return NextResponse.json({ message: "Erreur serveur." }, { status: 500 });
  }
}

// ❌ SUPPRIMER un utilisateur
export async function DELETE(req, { params }) {
  const user = await getUserFromRequest(req);
  const { id } = params;

  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ message: "Non autorisé." }, { status: 403 });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { id } });

    if (!existingUser) {
      return NextResponse.json({ message: "Utilisateur non trouvé." }, { status: 404 });
    }

    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ message: "Utilisateur supprimé avec succès." });
  } catch (error) {
    console.error("Erreur suppression utilisateur :", error);
    return NextResponse.json({ message: "Erreur serveur." }, { status: 500 });
  }
}
