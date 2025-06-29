"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Pencil, Plus, Store, Trash } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";
import AjoutBoutique from "../../admin/ajout-boutique/page";
import AjoutManager from "../ajout-manager/page";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function BoutiqueDashboard() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpenManager, setModalOpenManager] = useState(false);
  const [boutiques, setBoutiques] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedBoutique, setSelectedBoutique] = useState(null);
  const [newName, setNewName] = useState("");
  const [newManagerId, setNewManagerId] = useState("");
  const [availableManagers, setAvailableManagers] = useState([]);

  useEffect(() => {
    const fetchBoutiques = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/");
          return;
        }

        const res = await fetch("/api/admin/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Erreur serveur");
        setBoutiques(data.businesses || []);
      } catch (err) {
        console.error("Erreur de chargement des boutiques:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBoutiques();
  }, [router]);

  useEffect(() => {
    const fetchManagers = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("/api/admin/users/inactive-gerants", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setAvailableManagers(data.users);
        } else {
          console.error("Erreur chargement gérants:", data.message);
        }
      } catch (err) {
        console.error("Erreur API:", err);
      }
    };

    if (editModalOpen) {
      fetchManagers();
    }
  }, [editModalOpen]);

  // ✅ Confirmer mise à jour
  const handleUpdate = async () => {
    const confirmUpdate = confirm("Voulez-vous vraiment enregistrer ces modifications ?");
    if (!confirmUpdate) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/admin/business/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: selectedBoutique.businessId,
          name: newName,
          managerId: newManagerId || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      const updated = boutiques.map((b) =>
        b.businessId === selectedBoutique.businessId
          ? {
              ...b,
              businessName: newName,
              managerName:
                availableManagers.find((m) => m.id === newManagerId)?.name ||
                b.managerName,
            }
          : b
      );

      setBoutiques(updated);
      setEditModalOpen(false);
    } catch (err) {
      alert("Erreur lors de la mise à jour");
      console.error(err);
    }
  };

  // ✅ Suppression avec confirmation
  const handleDelete = async (id) => {
    const confirmDelete = confirm("Êtes-vous sûr de vouloir supprimer cette boutique ?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/admin/business/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setBoutiques((prev) => prev.filter((b) => b.businessId !== id));
      alert("Boutique supprimée.");
    } catch (err) {
      console.error("Erreur suppression boutique:", err);
      alert("Erreur lors de la suppression.");
    }
  };

  const filteredBoutiques = boutiques.filter((b) =>
    b.businessName.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="p-6 space-y-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <h1 className="text-2xl font-bold">Dashboard des Boutiques</h1>

          <div className="flex flex-wrap justify-center md:justify-end gap-2">
            <Button className="bg-green-600 text-white" onClick={() => setModalOpenManager(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Ajouter un gérant
            </Button>
            <Button className="bg-green-600 text-white" onClick={() => setModalOpen(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Ajouter une boutique
            </Button>
            <Button
              className="bg-green-600 text-white"
              onClick={() => router.push("/admin/list-gerants")}
            >
              Voir les gérants enregistrés
            </Button>
          </div>
        </div>

        <Input
          placeholder="Rechercher une boutique..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-md bg-white dark:bg-gray-700"
        />

        {loading ? (
          <p className="text-center text-gray-500">Chargement...</p>
        ) : filteredBoutiques.length === 0 ? (
          <p className="text-center text-gray-500">Aucune boutique trouvée.</p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredBoutiques.map((boutique) => (
              <Card
                key={boutique.businessId}
                className="relative bg-white dark:bg-gray-800 shadow-md"
              >
                <div className="absolute top-2 right-2 flex gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8"
                    onClick={() => {
                      setSelectedBoutique(boutique);
                      setNewName(boutique.businessName);
                      setNewManagerId("");
                      setEditModalOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    className="h-8 w-8"
                    onClick={() => handleDelete(boutique.businessId)} // ✅ suppression
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Store className="text-green-600" />
                    <div>
                      <CardTitle>{boutique.businessName}</CardTitle>
                      <CardDescription>
                        Gérant : {boutique.managerName || "Non assigné"}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Total ventes :{" "}
                    <span className="font-semibold text-green-700">
                      {boutique.revenue.toLocaleString()} FC
                    </span>
                  </p>
                  <Button
                    variant="outline"
                    className="w-full mt-3"
                    onClick={() => router.push(`/admin/boutique/${boutique.businessId}`)}
                  >
                    Voir boutique
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Modales */}
        <AjoutBoutique isOpen={modalOpen} onClose={() => setModalOpen(false)} />
        <AjoutManager
          isOpenManager={modalOpenManager}
          onCloseManager={() => setModalOpenManager(false)}
        />

        {/* Dialog d'édition */}
        <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modifier la boutique</DialogTitle>
              <DialogDescription>
                Changer le nom ou le gérant de la boutique
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm block mb-1">Nom de la boutique</label>
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm block mb-1">Gérant à assigner (facultatif)</label>
                <select
                  value={newManagerId}
                  onChange={(e) => setNewManagerId(e.target.value)}
                  className="mt-1 w-full rounded-md border px-4 py-2 bg-white text-gray-700"
                >
                  <option value="">-- Ne pas changer --</option>
                  {availableManagers.map((manager) => (
                    <option key={manager.id} value={manager.id}>
                      {manager.name} ({manager.email})
                    </option>
                  ))}
                </select>
              </div>
              <Button onClick={handleUpdate} className="w-full">
                Enregistrer les modifications
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
