import React from "react";

const AjoutBoutique = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-0"
      aria-modal="true"
      role="dialog"
      tabIndex={-1}
    >
      {/* Overlay fond noir semi-transparent léger */}
      <div
        className="fixed inset-0 bg-black"
        style={{ opacity: 0.25 }} // 25% d'opacité
        onClick={onClose} // cliquer sur fond ferme la modal
      />

      {/* Contenu modal */}
      <div className="relative bg-white w-full max-w-2xl rounded-xl p-8 shadow-2xl z-10">
        {/* Bouton Fermer */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition-colors duration-300 text-2xl font-bold"
          onClick={onClose}
          aria-label="Fermer la fenêtre"
        >
          &times;
        </button>
        {/* Titre */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Ajouter une boutique
        </h2>

        {/* Formulaire */}
        <form className="space-y-6">
          {/* Nom boutique */}
          <div>
            <label
              htmlFor="nom"
              className="block text-gray-700 font-medium mb-1"
            >
              Nom de la boutique <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="nom"
              placeholder="Ex : Boutique Josué"
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          {/* Adresse (optionnel) */}
          <div>
            <label
              htmlFor="adresse"
              className="block text-gray-700 font-medium mb-1"
            >
              Adresse (optionnel)
            </label>
            <input
              type="text"
              id="adresse"
              placeholder="Ex : 123 Rue Principale"
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Sélecteur Gérant */}
          <div>
            <label
              htmlFor="gerant"
              className="block text-gray-700 font-medium mb-1"
            >
              Gérant <span className="text-red-500">*</span>
            </label>
            <select
              id="gerant"
              className="w-full rounded-md border border-gray-300 px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              defaultValue=""
              required
            >
              <option value="" disabled>
                Choisir un gérant existant
              </option>
              <option>Paul</option>
              <option>Aline</option>
              <option>David</option>
              <option>Créer un nouveau gérant...</option>
            </select>
          </div>

          {/* Boutons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-md bg-green-600 text-white font-semibold hover:bg-green-700 transition"
            >
              Créer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AjoutBoutique;



// // import React, { useState, useRef } from "react";

// import React from "react";

// const AjoutBoutique = ({ isOpen, onClose }) => {
//   if (!isOpen) return null;

//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-0"
//       aria-modal="true"
//       role="dialog"
//       tabIndex={-1}
//     >
//       {/* Overlay noir semi-transparent */}
//       <div
//         className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm transition-opacity"
//         onClick={onClose}
//       />

//       {/* Modal */}
//       <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-xl p-8 shadow-2xl z-10">
//         {/* Bouton Fermer */}
//         <button
//           className="absolute top-4 right-4 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition duration-200 text-2xl font-bold"
//           onClick={onClose}
//           aria-label="Fermer"
//         >
//           &times;
//         </button>

//         {/* Titre */}
//         <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
//           Ajouter une boutique
//         </h2>

//         {/* Formulaire */}
//         <form className="space-y-6">
//           {/* Nom */}
//           <div>
//             <label
//               htmlFor="nom"
//               className="block text-gray-700 dark:text-gray-200 font-medium mb-1"
//             >
//               Nom de la boutique <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               id="nom"
//               placeholder="Ex : Boutique Josué"
//               className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//               required
//             />
//           </div>

//           {/* Adresse */}
//           <div>
//             <label
//               htmlFor="adresse"
//               className="block text-gray-700 dark:text-gray-200 font-medium mb-1"
//             >
//               Adresse (optionnel)
//             </label>
//             <input
//               type="text"
//               id="adresse"
//               placeholder="Ex : 123 Rue Principale"
//               className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//             />
//           </div>

//           {/* Gérant */}
//           <div>
//             <label
//               htmlFor="gerant"
//               className="block text-gray-700 dark:text-gray-200 font-medium mb-1"
//             >
//               Gérant <span className="text-red-500">*</span>
//             </label>
//             <select
//               id="gerant"
//               defaultValue=""
//               required
//               className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//             >
//               <option value="" disabled>
//                 Choisir un gérant existant
//               </option>
//               <option>Paul</option>
//               <option>Aline</option>
//               <option>David</option>
//               <option>Créer un nouveau gérant...</option>
//             </select>
//           </div>

//           {/* Boutons */}
//           <div className="flex justify-end gap-4">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-6 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
//             >
//               Annuler
//             </button>
//             <button
//               type="submit"
//               className="px-6 py-2 rounded-md bg-green-600 text-white font-semibold hover:bg-green-700 dark:hover:bg-green-500 transition"
//             >
//               Créer
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AjoutBoutique;
