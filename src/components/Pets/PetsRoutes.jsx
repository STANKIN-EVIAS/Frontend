import AddPet from "pages/Pets/AddPet";
import EditPetPage from "pages/Pets/EditPetPage.jsx";
import PetProfilePage from "pages/Pets/PetProfilePage.jsx";
import React from "react";
import { Route } from "react-router-dom";

export default function PetsRoutes() {
  return (
    <React.Fragment>
      <Route path="/pet/add" element={<AddPet />} />
      <Route path="/pet/:petId" element={<PetProfilePage />} /> {/* Добавьте этот маршрут */}
      <Route path="/pet/:petId/edit" element={<EditPetPage />} />
    </React.Fragment>
  );
}
