import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST() {
  try {
    // Vérifie s’il existe déjà un admin
    const existingAdmin = await prisma.user.findFirst({
      where: { role: "ADMIN" },
    });

    if (existingAdmin) {
      return NextResponse.json(
        { message: "Un compte admin existe déjà." },
        { status: 400 }
      );
    }

    // Crée un admin par défaut
    const defaultAdmin = await prisma.user.create({
      data: {
        name: "Admin Principal",
        email: process.env.ADMIN_EMAIL  ,
        password: await bcrypt.hash(process.env.ADMIN_PASSWORD, 10),
        role: "ADMIN",
        verified: true,
      },
    });

    return NextResponse.json({
      message: "Compte admin créé avec succès",
      admin: {
        id: defaultAdmin.id,
        email: defaultAdmin.email,
        name: defaultAdmin.name,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la création de l’admin :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
