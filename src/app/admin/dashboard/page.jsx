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
import AjoutBoutique from "../../admin/ajout-boutique/page"; // <-- importe la modal ici

const boutiquesData = [
  { id: 1, nom: "Boutique Josué", gerant: "Paul", ventes: 150000 },
  { id: 2, nom: "Market Central", gerant: "Aline", ventes: 220000 },
  // ...autres boutiques
];

export default function BoutiqueDashboard() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false); // état ouverture modal

  const filteredBoutiques = boutiquesData.filter((b) =>
    b.nom.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="p-6 space-y-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <h1 className="text-2xl font-bold">Dashboard des Boutiques</h1>
          <Button
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
            onClick={() => setModalOpen(true)} // ouvre la modal au clic
          >
            <Plus className="h-4 w-4" />
            Ajouter une boutique
          </Button>
        </div>

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

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 ">
          {filteredBoutiques.map((boutique) => (
            <Card key={boutique.id} className="bg-white dark:bg-gray-800 shadow-md">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Store className="text-green-600" />
                  <div>
                    <CardTitle>{boutique.nom}</CardTitle>
                    <CardDescription>
                      Gérant : {boutique.gerant}
                    </CardDescription>
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

        {/* Modal ajout boutique */}
        <AjoutBoutique isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      </div>
    </>
  );
}
