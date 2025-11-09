import ClinicsRoutes from "components/Clinics/ClinicsRoutes";
import PetsRoutes from "components/Pets/PetsRoutes.jsx";
import ReviewsRoutes from "components/Reviews/ReviewsRoutes.jsx";
import LoginPage from "pages/Auth/LoginPage.jsx";
import RegistrationPage from "pages/Auth/RegistrationPage.jsx";
import ContactsPage from "pages/Main/ContactsPage.jsx";
import HomePage from "pages/Main/HomePage.jsx";
import ServicesPage from "pages/ServicesPage/ServicesPage.jsx";
import SymptomsPage from "pages/SymptomsPage/SymptomsPage.jsx";
import UserProfilePage from "pages/Users/UserProfilePage.jsx";
import PetProfilePage from "pages/Users/PetProfilePage.jsx"; // Добавьте этот импорт
import React from "react";
import { Route, Routes } from "react-router-dom";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registration" element={<RegistrationPage />} />
      <Route path="/profile" element={<UserProfilePage />} />
      <Route path="/pet/:petId" element={<PetProfilePage />} /> {/* Добавьте этот маршрут */}
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/contacts" element={<ContactsPage />} />
      {ReviewsRoutes()}
      {ClinicsRoutes()}
      {PetsRoutes()}
      <Route path="/symptoms" element={<SymptomsPage />} />
    </Routes>
  );
}
