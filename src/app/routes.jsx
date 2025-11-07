import LoginPage from "pages/Auth/LoginPage.jsx";
import RegistrationPage from "pages/Auth/RegistrationPage.jsx";
import ClinicDetail from "pages/Clinics/ClinicDetail.jsx";
import ClinicsPage from "pages/Clinics/ClinicsPage.jsx";
import ContactsPage from "pages/Main/ContactsPage.jsx";
import HomePage from "pages/Main/HomePage.jsx";
import ReviewsPage from "pages/Main/ReviewsPage.jsx";
import ServicesPage from "pages/ServicesPage/ServicesPage.jsx";
import SymptomsPage from "pages/SymptomsPage/SymptomsPage.jsx";
import UserProfilePage from "pages/Users/UserProfilePage.jsx";
import React from "react";
import { Route, Routes } from "react-router-dom";

function clinics_routes() {
    return (
        <React.Fragment>
            <Route path="/clinics" element={<ClinicsPage />} />
            <Route path="/clinics/:id" element={<ClinicDetail />} />
        </React.Fragment>
    );
}

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registration" element={<RegistrationPage />} />
            <Route path="/profile" element={<UserProfilePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/contacts" element={<ContactsPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            {clinics_routes()}
            <Route path="/symptoms" element={<SymptomsPage />} />
        </Routes>
    );
}
