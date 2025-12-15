import AddPet from "pages/Pets/AddPet";
import EditPetPage from "pages/Pets/EditPetPage.jsx";
import PetProfilePage from "pages/Pets/PetProfilePage.jsx";
import MedCardPage from "pages/PetDocuments/MedCardPage.jsx";
import CertificatesPage from "pages/PetDocuments/CertificatesPage.jsx";
import PassportPage from "pages/PetDocuments/PassportPage.jsx";
import React from "react";
import { Route } from "react-router-dom";

export default function PetsRoutes() {
  return (
    <React.Fragment>
      <Route path="/pet/add" element={<AddPet />} />
      <Route path="/pet/:petId" element={<PetProfilePage />} /> {/* Добавьте этот маршрут */}
      <Route path="/pet/:petId/edit" element={<EditPetPage />} />
      <Route path="/pet/:petId/medical-card" element={<MedCardPage />} />
      <Route path="/pet/:petId/certificates" element={<CertificatesPage />} />
      <Route path="/pet/:petId/passport" element={<PassportPage />} />
    </React.Fragment>
  );
}
