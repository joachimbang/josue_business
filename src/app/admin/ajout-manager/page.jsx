"use client";

import React, { useState } from "react";

const AjoutManager = ({ isOpenManager, onCloseManager }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpenManager) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    setLoading(true);

    try {
        
        const token = localStorage.getItem("token");
        console.log("📦 Token récupéré depuis localStorage:", token);

        if (!token) {
          console.warn("⚠️ Aucun token trouvé.");
          setLoading(false);
          return;
        }
      const res = await fetch("/api/admin/manager/create-manager", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
          },
        credentials: "include", // ✅ Important pour envoyer les cookies
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-0"
      aria-modal="true"
      role="dialog"
      tabIndex={-1}
    >
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black"
        style={{ opacity: 0.25 }}
        onClick={onCloseManager}
      />

      {/* Modal content */}
      <div className="relative bg-white w-full max-w-xl rounded-xl p-8 shadow-2xl z-10">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition-colors duration-300 text-2xl font-bold"
          onClick={onCloseManager}
          aria-label="Fermer la fenêtre"
        >
          &times;
        </button>

        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Ajouter un gérant
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
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
              className="w-full rounded-md border text-black border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
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
              className="w-full rounded-md border text-black border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onCloseManager}
              className="px-6 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
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
      </div>
    </div>
  );
};

export default AjoutManager;
