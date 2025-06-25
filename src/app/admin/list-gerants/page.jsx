"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";

const ListGerants = () => {
  const router = useRouter();
  const [gerants, setGerants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGerants = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.warn("⚠️ Aucun token trouvé.");
          setLoading(false);
          return;
        }

        const res = await fetch("/api/admin/users/not-admin", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        setGerants(data.users);
      } catch (error) {
        console.error("Erreur lors du chargement des gérants :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGerants();
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-6 space-y-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Liste des Gérants</h1>
          <Button variant="outline" onClick={() => router.back()}>
            Retour
          </Button>
        </div>

        {loading ? (
          <p className="text-center text-gray-500 dark:text-gray-300">
            Chargement...
          </p>
        ) : gerants.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-300">
            Aucun gérant trouvé.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 dark:border-gray-700 rounded-md overflow-hidden">
              <thead className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                <tr>
                  <th className="border p-2">Nom</th>
                  <th className="border p-2">Email</th>
                  <th className="border p-2">Boutiques</th>
                  <th className="border p-2">Date d'ajout</th>
                </tr>
              </thead>
              <tbody>
                {gerants.map((user, index) => (
                  <tr
                    key={user.id}
                    className={`${
                      index % 2 === 0
                        ? "bg-gray-50 dark:bg-gray-800"
                        : "bg-white dark:bg-gray-950"
                    } hover:bg-gray-100 dark:hover:bg-gray-700`}
                  >
                    <td className="p-3">{user.name}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">
                      {user.managedBusinesses?.length > 0
                        ? user.managedBusinesses.map((b) => b.name).join(", ")
                        : "Aucune"}
                    </td>
                    <td className="p-3">
                      {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default ListGerants;
