"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil, Trash } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const ListGerants = () => {
  const router = useRouter();
  const [gerants, setGerants] = useState([]);
  const [filteredGerants, setFilteredGerants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  useEffect(() => {
    const fetchGerants = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/");
        return;
      }

      try {
        const res = await fetch("/api/admin/users/not-admin", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Erreur inconnue");

        setGerants(data.users);
        setFilteredGerants(data.users);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Erreur chargement gérants :", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    fetchGerants();
  }, [router]);

  useEffect(() => {
    const lowerQuery = query.toLowerCase();

    const filtered = gerants.filter((g) => {
      const matchesQuery =
        g.name.toLowerCase().includes(lowerQuery) ||
        g.email.toLowerCase().includes(lowerQuery);

      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "actif"
          ? g.verified === true
          : g.verified === false;

      return matchesQuery && matchesStatus;
    });

    setFilteredGerants(filtered);
  }, [query, statusFilter, gerants]);

  const handleDelete = async (id) => {
    const confirm = window.confirm("Voulez-vous vraiment supprimer ce gérant ?");
    if (!confirm) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`/api/admin/manager/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erreur suppression");
      setGerants(gerants.filter((u) => u.id !== id));
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la suppression.");
    }
  };

  const handleEdit = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`/api/admin/manager/${selectedUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: editName, email: editEmail }),
      });
      if (!res.ok) throw new Error("Erreur modification");
      const updated = gerants.map((u) =>
        u.id === selectedUser.id ? { ...u, name: editName, email: editEmail } : u
      );
      setGerants(updated);
      setEditDialogOpen(false);
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la modification.");
    }
  };

  if (!isAuthenticated && !loading) return null;

  return (
    <>
      <Navbar />
      <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-2xl font-semibold">Liste des Gérants</h1>
          <Button variant="outline" onClick={() => router.back()}>
            Retour
          </Button>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <Input
            placeholder="Rechercher un gérant par nom ou email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="max-w-md bg-white dark:bg-gray-700"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48 bg-white dark:bg-gray-700">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="actif">Actifs</SelectItem>
              <SelectItem value="inactif">Inactifs</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <p className="text-center text-gray-500 dark:text-gray-300">Chargement...</p>
        ) : filteredGerants.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-300">
            Aucun gérant correspondant.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 dark:border-gray-700 rounded-md overflow-hidden">
              <thead className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                <tr>
                  <th className="border p-2 text-left">Nom</th>
                  <th className="border p-2 text-left">Email</th>
                  <th className="border p-2 text-left">Boutiques</th>
                  <th className="border p-2 text-left">Statut</th>
                  <th className="border p-2 text-left">Date d'ajout</th>
                  <th className="border p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredGerants.map((user, index) => (
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
                      {Array.isArray(user.managedBusinesses)
                        ? user.managedBusinesses.length > 0
                          ? user.managedBusinesses.map((b) => b.name).join(", ")
                          : "Aucune"
                        : user.managedBusinesses
                        ? user.managedBusinesses.name
                        : "Aucune"}
                    </td>
                    <td className="p-3">{user.verified ? "Actif" : "Inactif"}</td>
                    <td className="p-3">{new Date(user.createdAt).toLocaleDateString("fr-FR")}</td>
                    <td className="p-3 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setEditName(user.name);
                          setEditEmail(user.email);
                          setEditDialogOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(user.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal édition */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modifier le gérant</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Nom"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
              <Input
                placeholder="Email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
              />
              <Button className="w-full" onClick={handleEdit}>
                Enregistrer les modifications
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default ListGerants;
