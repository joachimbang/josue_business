"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, Trash } from "lucide-react";
import Navbar from "@/components/navbar";

const Page = () => {
  // Données fictives d’articles existants
  const [articles, setArticles] = useState([
    { nom: "Thé", prix: 1000, quantite: 10 },
    { nom: "Café", prix: 1500, quantite: 5 },
    { nom: "Pain", prix: 500, quantite: 20 },
  ]);

  // Formulaire dynamique pour ajouter des articles
  const [formFields, setFormFields] = useState([
    { nom: "", prix: "", quantite: "", description: "" },
  ]);

  const handleChange = (index, field, value) => {
    const newFields = [...formFields];
    newFields[index][field] = value;
    setFormFields(newFields);
  };

  const handleAddField = () => {
    setFormFields([
      ...formFields,
      { nom: "", prix: "", quantite: "", description: "" },
    ]);
  };

  const handleRemoveField = (index) => {
    if (formFields.length > 1) {
      const newFields = formFields.filter((_, i) => i !== index);
      setFormFields(newFields);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nouveaux = formFields.filter(
      (f) => f.nom.trim() !== "" && f.prix !== ""
    );
    if (nouveaux.length === 0) return;

    setArticles([...articles, ...nouveaux]);
    setFormFields([{ nom: "", prix: "", quantite: "", description: "" }]);
  };

  return (
    <>
      <Navbar />
      <div className="p-6 space-y-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
        {/* Liste des articles */}
        <Card className="bg-white dark:bg-gray-800 shadow-md">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100">
              Articles disponibles
            </CardTitle>
          </CardHeader>
          <CardContent>
            {articles.filter((a) => a.quantite > 0).length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">
                Aucun article disponible
              </p>
            ) : (
              <ul className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {articles
                  .filter((article) => article.quantite > 0)// pour ne pas affiche un article qui n'a pas de quantité
                  .map((article, idx) => (
                    <li
                      key={idx}
                      className="p-4 border rounded bg-gray-100 dark:bg-gray-700 shadow-sm"
                    >
                      <h4 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                        {article.nom}
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300">
                        Prix : {article.prix} FC
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">
                        Quantité : {article.quantite}
                      </p>
                      {article.description && (
                        <p className="text-gray-600 dark:text-gray-400 italic text-sm mt-1">
                          {article.description}
                        </p>
                      )}
                    </li>
                  ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Formulaire d’ajout */}
        <Card className="bg-white dark:bg-gray-800 shadow-md">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100">
              Ajouter des articles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {formFields.map((field, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end border-b border-gray-300 dark:border-gray-700 pb-4 mb-4"
                >
                  <div>
                    <Label className="text-gray-900 dark:text-gray-200">
                      Nom *
                    </Label>
                    <Input
                      value={field.nom}
                      onChange={(e) => handleChange(index, "nom", e.target.value)}
                      placeholder="Ex: Jus"
                      required
                      className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-900 dark:text-gray-200">
                      Prix *
                    </Label>
                    <Input
                      type="number"
                      value={field.prix}
                      onChange={(e) =>
                        handleChange(index, "prix", e.target.value)
                      }
                      placeholder="Ex: 2000"
                      required
                      className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-900 dark:text-gray-200">
                      Quantité
                    </Label>
                    <Input
                      type="number"
                      value={field.quantite}
                      onChange={(e) =>
                        handleChange(index, "quantite", e.target.value)
                      }
                      placeholder="Ex: 4"
                      className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-900 dark:text-gray-200">
                      Description
                    </Label>
                    <Input
                      value={field.description}
                      onChange={(e) =>
                        handleChange(index, "description", e.target.value)
                      }
                      placeholder="Optionnel"
                      className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    {formFields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => handleRemoveField(index)}
                        className="text-red-600 hover:text-red-800"
                        aria-label="Supprimer ce champ"
                      >
                        <Trash className="w-5 h-5" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <Button
                  type="button"
                  onClick={handleAddField}
                  variant="outline"
                  className="w-full md:w-auto flex items-center justify-center gap-2"
                >
                  <Plus className="h-5 w-5" /> Ajouter un champ
                </Button>

                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 dark:hover:bg-green-500 text-white w-full md:w-auto"
                >
                  Enregistrer les articles
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Page;
