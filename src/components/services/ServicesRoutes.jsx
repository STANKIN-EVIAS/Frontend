import ServicesPage from "pages/ServicesPage/ServicesPage.jsx";
import React from "react";
import { Route } from "react-router-dom";

export default function ServicesRoutes() {
  return (
    <React.Fragment>
      <Route path="/services" element={<ServicesPage />} />
    </React.Fragment>
  );
}
