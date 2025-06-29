"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const AjoutBoutique = ({ isOpen, onClose }) => {
  const [nom, setNom] = useState("");
  const [adresse, setAdresse] = useState("");
  const [gerantId, setGerantId] = useState("");
  const [gerants, setGerants] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInactiveGerants = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("/api/admin/users/inactive-gerants", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setGerants(data.users);
      } catch (error) {
        console.error("Erreur chargement gérants inactifs:", error);
      }
    };

    if (isOpen) {
      fetchInactiveGerants();
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/admin/business/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: nom,
          address: adresse,
          managerId: gerantId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("✅ Boutique créée !");
      setNom("");
      setAdresse("");
      setGerantId("");
      onClose(); // fermer la modal
    } catch (err) {
      console.error("Erreur création boutique:", err);
      toast.error(err.message || "Erreur lors de la création.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Ajouter une boutique</DialogTitle>
          <DialogDescription>
            Remplis le formulaire ci-dessous pour créer une nouvelle boutique.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="nom" className="block text-sm font-medium">
              Nom de la boutique <span className="text-red-500">*</span>
            </label>
            <input
              id="nom"
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
              className="mt-1 w-full rounded-md border text-black border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label htmlFor="adresse" className="block text-sm font-medium">
              Adresse de la boutique
            </label>
            <input
              id="adresse"
              type="text"
              value={adresse}
              onChange={(e) => setAdresse(e.target.value)}
              className="mt-1 w-full rounded-md border text-black border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label htmlFor="gerant" className="block text-sm font-medium">
              Gérant <span className="text-red-500">*</span>
            </label>
            <select
              id="gerant"
              value={gerantId}
              onChange={(e) => setGerantId(e.target.value)}
              required
              className="mt-1 w-full rounded-md border px-4 py-2 bg-white text-gray-700"
            >
              <option value="" disabled>
                Choisir un gérant inactif
              </option>
              {gerants.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name} ({g.email})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-md border text-gray-700 hover:bg-gray-100"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
            >
              {loading ? "Création..." : "Créer"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AjoutBoutique;
