// pages/gerant/dashboard.jsx
"use client";
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";
import { useRouter } from "next/navigation";

const GerantDashboard = () => {
  const router = useRouter();

  return (
    <>
      <Navbar />
      <div className="p-6 space-y-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <h1 className="text-2xl font-bold">Dashboard du Gérant</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-white dark:bg-gray-800 shadow-md">
            <CardHeader>
              <CardTitle>Ventes du jour</CardTitle>
            </CardHeader>
            <CardContent className="text-xl text-green-600 font-bold">
              45 000 FC
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-md">
            <CardHeader>
              <CardTitle>Articles disponibles</CardTitle>
            </CardHeader>
            <CardContent className="text-xl font-bold">28</CardContent>
          </Card>
        </div>
{/* actions */}
        <div className="flex gap-4 pt-2">
          <Button onClick={() => router.push("/gerant/ventes")}>
            Saisir des ventes
          </Button>
          <Button onClick={() => router.push("/gerant/historique")}>
            Historique des ventes
          </Button>
        </div>
      </div>
    </>
  );
};

export default GerantDashboard;
