"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const AjoutManager = ({ isOpenManager, onCloseManager }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.warn("⚠️ Aucun token trouvé.");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/admin/manager/create-manager", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ name, email }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Erreur lors de la création.");
      } else {
        alert("Gérant créé avec succès !");
        setName("");
        setEmail("");
        onCloseManager();
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpenManager} onOpenChange={onCloseManager}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Ajouter un gérant</DialogTitle>
          <DialogDescription>
            Remplis les informations pour créer un nouveau gérant.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-2">
          <div>
            <label htmlFor="nom" className="block text-gray-700 font-medium mb-1">
              Nom du gérant <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="nom"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex : Jean Dupont"
              required
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ex : jean@example.com"
              required
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="flex justify-end gap-4 pt-2">
            <button
              type="button"
              onClick={onCloseManager}
              className="px-6 py-2 rounded-md border text-gray-700 hover:bg-gray-100"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-md bg-green-600 text-white font-semibold hover:bg-green-700"
            >
              {loading ? "Création..." : "Créer"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AjoutManager;
