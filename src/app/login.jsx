"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Mail, Lock } from "lucide-react";
import ModeToggle from "@/components/ModeToogle";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email && password) {
      if (email === "admin@example.com" && password === "admin123") {
        router.push("/admin/dashboard");
      }
      
      else if(email === "gerant@example.com" && password === "gerant123"){
        router.push("/gerant/dashboard");
      }
    } else {
      alert("Veuillez remplir tous les champs.");
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900 px-4 flex items-center justify-center">
      {/* Toggle thème positionné en haut à droite */}
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>

      <Card className="w-full max-w-md shadow-lg border-0 bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Connexion
          </CardTitle>
          <CardDescription className="text-center">
            Accédez à votre tableau de bord
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="focus-visible:ring-green-600"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="focus-visible:ring-green-600"
                />
              </div>
            </div>

            <div className="flex justify-between text-sm">
              <span>Mot de passe oublié ?</span>
              <a href="/ForgetPassword" className="hover:underline text-blue-700">
                Récupérer
              </a>
            </div>

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium"
            >
              Se connecter
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
