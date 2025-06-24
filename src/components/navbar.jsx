"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { BriefcaseBusiness, LogIn } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ModeToggle from "./ModeToogle";

function Navbar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("📦 Token récupéré depuis localStorage:", token);

        if (!token) {
          console.warn("⚠️ Aucun token trouvé.");
          setLoading(false);
          return;
        }

        const res = await fetch("/api/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        console.log("📨 Données de /api/me:", data);

        if (!res.ok || !data.user) {
          console.warn("⚠️ Réponse invalide ou utilisateur non trouvé.");
          setLoading(false);
          return;
        }

        setUser(data.user);
      } catch (err) {
        console.error("❌ Erreur lors du fetch user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
  try {
    // Appel à l'API pour supprimer le cookie côté serveur
    const res = await fetch("/api/auth/logout", {
      method: "POST",
    });

    if (res.ok) {
      // Nettoyer le token du localStorage s’il y était stocké aussi
      localStorage.removeItem("token");
      setUser(null);
      router.push("/"); // Redirection vers page de connexion ou accueil
    } else {
      console.error("Erreur lors de la déconnexion");
    }
  } catch (error) {
    console.error("Erreur logout:", error);
  }
};


  return (
    <nav className="sticky top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="flex items-center h-16 justify-between px-4">
        {/* Logo */}
        <Link href="/admin/dashboard" className="flex items-center space-x-2">
          <BriefcaseBusiness className="md:size-12" />
          <span className="md:text-3xl font-bold font-mono tracking-wider">
            Josue Business
          </span>
        </Link>

        {/* Navigation actions */}
        <div className="md:flex items-center space-x-4">
          {loading ? (
            <span className="text-muted-foreground text-sm">Chargement...</span>
          ) : user ? (
            <div className="flex items-center gap-4">
              <ModeToggle />
              <span className="hidden lg:inline">{user.name || "Utilisateur"}</span>
              <Avatar>
                <AvatarImage
                  src={user.avatar || "https://github.com/shadcn.png"}
                  alt={user.name}
                />
                <AvatarFallback>{user.name?.[0]?.toUpperCase() ?? "U"}</AvatarFallback>
              </Avatar>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="ml-2"
              >
                Se déconnecter
              </Button>
            </div>
          ) : (
            <Button variant="ghost" className="flex items-center gap-2" asChild>
              <Link href="/">
                <LogIn className="w-4 h-4" />
                <span className="hidden lg:inline">Sign In</span>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
