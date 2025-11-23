import LoginPage from "pages/Auth/LoginPage.jsx";
import RegistrationPage from "pages/Auth/RegistrationPage.jsx";
import React from "react";
import { Route } from "react-router-dom";

export default function AuthRoutes() {
  return (
    <React.Fragment>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registration" element={<RegistrationPage />} />
    </React.Fragment>
  );
}
