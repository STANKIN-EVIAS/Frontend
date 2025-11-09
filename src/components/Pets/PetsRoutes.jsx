import AddPet from "pages/Pets/AddPet";
import React from "react";
import { Route } from "react-router-dom";

export default function PetsRoutes() {
  return (
    <React.Fragment>
      <Route path="/pets/add" element={<AddPet />} />
    </React.Fragment>
  );
}
