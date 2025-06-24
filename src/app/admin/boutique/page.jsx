"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";

const BoutiqueDashboard = () => {
  const router = useRouter();

  const boutique = {
    nom: "Café Josué",
    adresse: "123 Rue des Entrepreneurs",
    dateCreation: "2023-04-10",
    gerant: {
      nom: "Alice Ndaye",
      contact: "+243 970 123 456",
    },
    stats: {
      ventesJour: "45 000 FC",
      ventesSemaine: "280 000 FC",
      ventesMois: "1 200 000 FC",
      articlesDisponibles: 28,
      derniereVente: "2025-06-16 à 15h42",
    },
  };

  const dataweeks = [
    { jour: "Lun", commandes: 12 },
    { jour: "Mar", commandes: 8 },
    { jour: "Mer", commandes: 15 },
    { jour: "Jeu", commandes: 10 },
    { jour: "Ven", commandes: 18 },
    { jour: "Sam", commandes: 10 },
    { jour: "Dim", commandes: 18 },
  ];
  const datamonths = [
    { mois: "Jan", commandes: 12 },
    { mois: "Fév", commandes: 8 },
    { mois: "Mar", commandes: 15 },
    { mois: "Avr", commandes: 10 },
    { mois: "Mai", commandes: 18 },
    { mois: "Juin", commandes: 22 },
    { mois: "Juil", commandes: 17 },
    { mois: "Août", commandes: 15 },
    { mois: "Sept", commandes: 10 },
    { mois: "Oct", commandes: 18 },
    { mois: "Nov", commandes: 22 },
    { mois: "Déc", commandes: 17 },
  ];

  return (
    <>
      <Navbar />

      <div className="p-6 space-y-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
        {/* Infos boutique */}
        <Card className="bg-white dark:bg-gray-800 shadow-md">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100">Informations sur la boutique</CardTitle>
            <CardDescription className=" text-gray-700 dark:text-gray-300">
              Détails de la boutique et du gérant
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 text-sm text-gray-700">
            <div className="text-gray-700 dark:text-gray-300">
              <strong className="text-gray-900 dark:text-gray-100">Nom :</strong> {boutique.nom}
            </div>
            <div className="text-gray-700 dark:text-gray-300">
              <strong className="text-gray-900 dark:text-gray-100">Adresse :</strong> {boutique.adresse}
            </div>
            <div className="text-gray-700 dark:text-gray-300">
              <strong className="text-gray-900 dark:text-gray-100">Date de création :</strong> {boutique.dateCreation}
            </div>
            <div className="text-gray-700 dark:text-gray-300">
              <strong className="text-gray-900 dark:text-gray-100">Gérant :</strong> {boutique.gerant.nom}
            </div>
            <div className="text-gray-700 dark:text-gray-300">
              <strong className="text-gray-900 dark:text-gray-100">Contact :</strong> {boutique.gerant.contact}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-300">
          <Button
            onClick={() => router.push("/admin/articles")}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Gérer les articles
          </Button>
          <Button
            onClick={() => router.push("/admin/ventes")}
            variant="outline"
            className="text-blue-700 hover:bg-blue-100"
          >
            Voir les ventes
          </Button>
          <Button
            onClick={() => router.push("/admin/gerant-gestion")}
            variant="outline"
            className="text-blue-700 hover:bg-blue-100"
          >
            Gérer le gérant
          </Button>
          <Button onClick={() => alert("Impression lancée")} variant="outline" className="text-gray-700 hover:bg-gray-200 dark:text-gray-300">
            Imprimer les ventes
          </Button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white dark:bg-gray-800 shadow-md">
            <CardHeader>
              <CardTitle className="text-green-800">Ventes du jour</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold text-green-600">
              {boutique.stats.ventesJour}
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-md">
            <CardHeader>
              <CardTitle className="text-blue-800">Ventes de la semaine</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold text-blue-600">
              {boutique.stats.ventesSemaine}
            </CardContent>
          </Card >

          <Card className="bg-white dark:bg-gray-800 shadow-md">
            <CardHeader>
              <CardTitle className="text-indigo-800 dark:font-bold">Ventes du mois</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold text-indigo-600">
              {boutique.stats.ventesMois}
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-md">
            <CardHeader>
              <CardTitle className="text-gray-900 font-extrabold dark:text-gray-100">Dernière vente</CardTitle>
            </CardHeader>
            <CardContent className="text-md  text-gray-700 dark:text-gray-300">
              {boutique.stats.derniereVente}
            </CardContent>
          </Card>
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-white dark:bg-gray-800 shadow-md">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-gray-100">
                Évolution de la vente par semaine
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <LineChart
                    data={dataweeks}
                    margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="jour" stroke="#475569" />
                    <YAxis stroke="#475569" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#f9fafb", borderRadius: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="commandes"
                      stroke="#2563eb" // Bleu vif
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-md">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-gray-100">
                Évolution des commandes par an
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <BarChart className="bg-white dark:bg-gray-800 "
                    data={datamonths}
                    margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="mois" stroke="#475569" />
                    <YAxis stroke="#475569" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#f9fafb", borderRadius: 6 }}
                    />
                    <Bar dataKey="commandes" fill="#16a34a" /> {/* Vert nature */}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default BoutiqueDashboard;
