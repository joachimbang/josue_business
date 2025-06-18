// pages/admin/boutiques/[id]/gerant.jsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/navbar";

export default function GerantGestion() {
  const router = useRouter();
  const [existingManager, setExistingManager] = useState(false);
  const [manager, setManager] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleSave = () => {
    if (!manager.name || !manager.email || !manager.phone) {
      alert("Tous les champs sont obligatoires.");
      return;
    }
    // TODO: Send PUT or POST request here
    alert("Gérant mis à jour !");
  };

  return (
    <>
      <Navbar />
      <div className="p-6 space-y-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="max-w-2xl mx-auto ">
        {existingManager ? (
          <>
            <h1 className="text-2xl font-bold mb-4">Ajouter un Gérant</h1>
            <form >
                <Input
              placeholder="Nom"
              className="mb-3"
              value={manager.name}
              onChange={(e) => setManager({ ...manager, name: e.target.value })}
            />
            <Input
              placeholder="Email"
              className="mb-3"
              type="email"
              value={manager.email}
              onChange={(e) =>
                setManager({ ...manager, email: e.target.value })
              }
            />
            <Input
              placeholder="Téléphone"
              className="mb-3"
              value={manager.phone}
              onChange={(e) =>
                setManager({ ...manager, phone: e.target.value })
              }
            />
            <div className="flex gap-4">
              <button
                onClick={handleSave}
                type="submit"
                className="px-6 py-2 rounded-md bg-green-600 text-white font-semibold hover:bg-green-700 transition"
              >
                Enregistrer
              </button>
              <Button variant="outline" onClick={() => router.back()}>
                Annuler
              </Button>
            </div>
            </form>
            
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-4">Gérant Actuel</h1>
            
            <Card className="p-4 mb-6 bg-white dark:bg-gray-800 shadow-md">
              <p className="font-semibold">Nom : Jean Dupont</p>
              <p>Email : jean@example.com</p>
              <p>Téléphone : +243 970000000</p>
            </Card>
            <button
                // onClick={handleSave}
                type="submit"
                className="px-6 py-2 rounded-md bg-green-600 text-white font-semibold hover:bg-green-700 transition"
              >Supprimer le gerant
                </button>
          </>
        )}
      </div>
      </div>
      
    </>
  );
}
// This code defines a simple page for managing a store manager's details.
// It includes a form to either select an existing manager or create a new one.
