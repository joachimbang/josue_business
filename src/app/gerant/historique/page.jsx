// pages/gerant/ventes/historique.jsx
"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/navbar";
import DetailsVentes from "../details-vente/page";
import { useRouter } from "next/navigation";

const ventesFictives = [
  { date: "2025-06-15", total: 32000 },
  { date: "2025-06-16", total: 45000 },
  { date: "2025-06-17", total: 51000 },
];

const HistoriqueVentes = () => {
    const router = useRouter();
  const [filtre, setFiltre] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");

  const ventesFiltrees = ventesFictives
    .filter((v) => {
      if (!dateDebut && !dateFin) return true;
      const dateVente = new Date(v.date);
      const debut = dateDebut ? new Date(dateDebut) : null;
      const fin = dateFin ? new Date(dateFin) : null;
      return (!debut || dateVente >= debut) && (!fin || dateVente <= fin);
    })
    .filter((h) => h.date.includes(filtre));

  return (
    <>
      <>
        <Navbar />
        <div className="p-6 space-y-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
          <h1 className="text-2xl font-bold">Historique des ventes</h1>

          <div className="flex flex-wrap gap-4 justify-end">
            <p className="flex items-center">Trier par date</p>
            <Input
              type="date"
              value={dateDebut}
              onChange={(e) => setDateDebut(e.target.value)}
              className="w-38 flex justify-end"
            />
            <Input
              type="date"
              value={dateFin}
              onChange={(e) => setDateFin(e.target.value)}
              className="w-38 flex justify-end"
            />
            
          </div>

          {ventesFiltrees.map((vente, index) => (
            <Card key={index} className="bg-white dark:bg-gray-800 shadow-md">
                
              <CardHeader>
                <CardTitle>{vente.date}</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-between">
                <div>Total : {vente.total} FC</div>
                <Button
                  variant="outline"
                  className=" bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  onClick={() => router.push("/gerant/details-vente")} // ouvre la modal au clic
                >
                  Voir détails
                </Button>
                {/* <Button variant="outline" onClick={() => setModalOpen(true)}>
                  Voir détails
                </Button> */}
              </CardContent>
            </Card>
          ))}
        </div>
      </>
      
    </>
  );
};

export default HistoriqueVentes;
