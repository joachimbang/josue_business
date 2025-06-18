"use client";

import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";
import { Printer } from "lucide-react";
import { useReactToPrint } from "react-to-print";

const ventesFictives = [
  {
    date: "2024-06-15",
    articles: [
      { nom: "Café", quantite: 2, prix: 1500 },
      { nom: "Pain", quantite: 3, prix: 500 },
      { nom: "Café", quantite: 2, prix: 1500 },
      { nom: "Pain", quantite: 3, prix: 500 },
    ],
  },
  {
    date: "2024-06-15",
    articles: [
      { nom: "Café", quantite: 2, prix: 1500 },
      { nom: "Pain", quantite: 3, prix: 500 },
      { nom: "Café", quantite: 2, prix: 1500 },
      { nom: "Pain", quantite: 3, prix: 500 },
    ],
  },
  {
    date: "2024-06-15",
    articles: [
      { nom: "Café", quantite: 2, prix: 1500 },
      { nom: "Pain", quantite: 3, prix: 500 },
      { nom: "Café", quantite: 2, prix: 1500 },
      { nom: "Pain", quantite: 3, prix: 500 },
    ],
  },
  {
    date: "2024-06-14",
    articles: [
      { nom: "Thé", quantite: 1, prix: 1000 },
      { nom: "Croissant", quantite: 2, prix: 1200 },
      { nom: "Thé", quantite: 1, prix: 1000 },
      { nom: "Croissant", quantite: 2, prix: 1200 },
    ],
  },
];

const Page = () => {
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const printComponentRef = useRef(null);
  const boutiquename = "Café Josué";

  const ventesFiltrees = ventesFictives.filter((v) => {
    if (!dateDebut && !dateFin) return true;
    const dateVente = new Date(v.date);
    const debut = dateDebut ? new Date(dateDebut) : null;
    const fin = dateFin ? new Date(dateFin) : null;
    return (!debut || dateVente >= debut) && (!fin || dateVente <= fin);
  });

  const calculerTotal = (articles) =>
    articles.reduce((t, a) => t + a.prix * a.quantite, 0);

  const handlePrint = useReactToPrint({
    content: () => printComponentRef.current,
    documentTitle: "ventes",
    removeAfterPrint: true,
  });

  return (  
    <>
      <Navbar />
      <div className="p-6 space-y-6 bg-gray-50 text-gray-900 dark:dark:bg-gray-900 dark:text-gray-100 min-h-screen">
        {/* Filtres + bouton export */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Du :</label>
              <Input
                type="date"
                value={dateDebut}
                onChange={(e) => setDateDebut(e.target.value)}
                className="w-40"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Au :</label>
              <Input
                type="date"
                value={dateFin}
                onChange={(e) => setDateFin(e.target.value)}
                className="w-40"
              />
            </div>
          </div>

          <Button
            onClick={handlePrint}
            className="bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-400"
          >
            <Printer className="w-4 h-4 mr-2" />
            Imprimer les ventes
          </Button>
        </div>

        {/* Zone à imprimer */}
        <div ref={printComponentRef} className="overflow-x-auto">
          <h1 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">
            Historique des ventes de {boutiquename}
          </h1>
          {ventesFiltrees.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">
              Aucune vente pour cette période sélectionnée.
            </p>
          ) : (
            <table className="w-full border-collapse border border-gray-300 dark:border-gray-700 rounded-md overflow-hidden">
              <thead className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                <tr>
                  <th className="border border-gray-300 dark:border-gray-700 p-2">Date</th>
                  <th className="border border-gray-300 dark:border-gray-700 p-2">Articles</th>
                  <th className="border border-gray-300 dark:border-gray-700 p-2">Total (FC)</th>
                </tr>
              </thead>
              <tbody>
                {ventesFiltrees.map((vente, index) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0
                        ? "bg-gray-50 dark:bg-gray-800"
                        : "bg-white dark:bg-gray-950"
                    } hover:bg-gray-100 dark:hover:bg-gray-700`}
                  >
                    <td className="border border-gray-300 dark:border-gray-700 p-2 align-top">
                      {vente.date}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-700 p-2">
                      <ul className="list-disc pl-5 m-0 space-y-1">
                        {vente.articles.map((a, i) => (
                          <li key={i}>
                            {a.nom} x {a.quantite} @ {a.prix} FC
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="border border-gray-300 dark:border-gray-700 p-2 text-right font-semibold">
                      {calculerTotal(vente.articles)} FC
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default Page;
