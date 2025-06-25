"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Plus, Store } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";
import AjoutBoutique from "../../admin/ajout-boutique/page";
import AjoutManager from "../ajout-manager/page";

const boutiquesData = [
  { id: 1, nom: "Boutique Josué", gerant: "Paul", ventes: 150000 },
  { id: 2, nom: "Market Central", gerant: "Aline", ventes: 220000 },
];

export default function BoutiqueDashboard() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpenManager, setModalOpenManager] = useState(false);

  const filteredBoutiques = boutiquesData.filter((b) =>
    b.nom.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="p-6 space-y-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
        {/* En-tête */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <h1 className="text-2xl font-bold">Dashboard des Boutiques</h1>

          <div className="flex flex-wrap justify-center md:justify-end gap-2">
            <Button
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
              onClick={() => setModalOpenManager(true)}
            >
              <Plus className="h-4 w-4" />
              Ajouter un gérant
            </Button>

            <Button
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
              onClick={() => setModalOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Ajouter une boutique
            </Button>

            <Button
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
              onClick={() => router.push("/admin/list-gerants")}
            >
              
              Voir les gérants enregistrés
            </Button>
          </div>
        </div>

        {/* Recherche */}
        <div className="flex justify-start">
          <div className="flex items-center gap-2 max-w-md w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
            <Input
              placeholder="Rechercher une boutique..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9 w-full"
            />
          </div>
        </div>

        {/* Cartes boutiques */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredBoutiques.map((boutique) => (
            <Card key={boutique.id} className="bg-white dark:bg-gray-800 shadow-md">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Store className="text-green-600" />
                  <div>
                    <CardTitle>{boutique.nom}</CardTitle>
                    <CardDescription>Gérant : {boutique.gerant}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Total ventes :{" "}
                  <span className="font-semibold text-green-700">
                    {boutique.ventes.toLocaleString()} FC
                  </span>
                </p>
                <Button
                  variant="outline"
                  className="w-full text-sm mt-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  onClick={() => router.push(`/admin/boutique/`)}
                >
                  Voir boutique
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Modales */}
        <AjoutBoutique isOpen={modalOpen} onClose={() => setModalOpen(false)} />
        <AjoutManager isOpenManager={modalOpenManager} onCloseManager={() => setModalOpenManager(false)} />
      </div>
    </>
  );
}
