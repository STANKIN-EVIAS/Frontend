import ContactsPage from "pages/Main/ContactsPage.jsx";
import HomePage from "pages/Main/HomePage.jsx";
import React from "react";
import { Route } from "react-router-dom";

export default function MainRoutes() {
  return (
    <React.Fragment>
      <Route path="/" element={<HomePage />} />
      <Route path="/contacts" element={<ContactsPage />} />
    </React.Fragment>
  );
}
