// pages/gerant/ventes/saisie.jsx
"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/navbar";

const articles = [
  { id: 1, nom: "Café noir", prix: 500 },
  { id: 2, nom: "Thé vert", prix: 600 },
  { id: 3, nom: "Beignet", prix: 300 },
];

const SaisieVentes = () => {
  const [quantites, setQuantites] = useState({});
  const [remarque, setRemarque] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (id, value) => {
    setQuantites({ ...quantites, [id]: Number(value) });
  };

  const total = articles.reduce((sum, a) => {
    return sum + (quantites[a.id] || 0) * a.prix;
  }, 0);

  const handleSubmit = () => {
    // Simule validation
    setMessage("Vente enregistrée avec succès ✅");
  };

  return (
    <>
      <Navbar />
      <div className="p-6 space-y-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <h1 className="text-2xl font-bold">Saisie des ventes</h1>
        <Card className="bg-white dark:bg-gray-800 shadow-md">
          {articles.map((article) => (
            <div key={article.id}>
              <CardHeader>
                <CardTitle>
                  {article.nom} - {article.prix} FC
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Input className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  type="number"
                  placeholder="Quantité vendue"
                  value={quantites[article.id] || ""}
                  onChange={(e) => handleChange(article.id, e.target.value)}
                />
              </CardContent>
            </div>
          ))}
        </Card>

        <Card className="bg-white dark:bg-gray-800 shadow-md">
          <CardHeader>
            <CardTitle>Total</CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-bold">{total} FC</CardContent>
        </Card>

        <textarea
          placeholder="Remarque (facultatif)"
          className="w-full border rounded p-2"
          value={remarque}
          onChange={(e) => setRemarque(e.target.value)}
        />

        {message && <p className="text-green-600 font-semibold">{message}</p>}

        <Button onClick={handleSubmit}>Valider la saisie</Button>
      </div>
    </>
  );
};

export default SaisieVentes;
