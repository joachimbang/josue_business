// pages/gerant/ventes/details/[date].jsx
"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";

const DetailsVentesPage = () => {
  const router = useRouter();

  const date = "2025-06-16";
  const ventes = Array.from({ length: 10 }).map((_, i) => ({
    article: `Article ${i + 1}`,
    prix: 1000 * (i + 1), // prix en nombre pour total
  }));

  const total = ventes.reduce((sum, v) => sum + v.prix, 0);

  return (
    <>
      <Navbar />
      <div className="p-6 space-y-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold ">
            Détails des ventes du {date}
          </h1>
          <Button variant="outline" onClick={() => router.back()}>
            Retour
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 dark:border-gray-700 rounded-md overflow-hidden">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
              <tr>
                <th className="border border-gray-300 dark:border-gray-700 p-2 ">Article</th>
                <th className="border border-gray-300 dark:border-gray-700 p-2 text-right">Prix unitaire</th>
              </tr>
            </thead>
            <tbody>
              {ventes.map((vente, index) => (
                <tr key={index} className={`${
                      index % 2 === 0
                        ? "bg-gray-50 dark:bg-gray-800"
                        : "bg-white dark:bg-gray-950"
                    } hover:bg-gray-100 dark:hover:bg-gray-700`}>
                  <td className="p-3">{vente.article}</td>
                  <td className="p-3 text-right">{vente.prix.toLocaleString()} FC</td>
                </tr>
              ))}
              <tr className="bg-green-100 font-semibold text-green-800">
                <td className="p-3">Total</td>
                <td className="p-3 text-right">{total.toLocaleString()} FC</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default DetailsVentesPage;
