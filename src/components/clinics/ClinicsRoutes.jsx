import ClinicDetail from "pages/Clinics/ClinicPage.jsx";
import ClinicsPage from "pages/Clinics/ClinicsPage.jsx";
import React from "react";
import { Route } from "react-router-dom";

export default function ClinicsRoutes() {
  return (
    <React.Fragment>
      <Route path="/clinics" element={<ClinicsPage />} />
      <Route path="/clinics/:id" element={<ClinicDetail />} />
    </React.Fragment>
  );
}
