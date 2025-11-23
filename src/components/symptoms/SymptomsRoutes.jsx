import SymptomsPage from "pages/SymptomsPage/SymptomsPage.jsx";
import React from "react";
import { Route } from "react-router-dom";

export default function SymptomsRoutes() {
  return (
    <React.Fragment>
      <Route path="/symptoms" element={<SymptomsPage />} />
    </React.Fragment>
  );
}
