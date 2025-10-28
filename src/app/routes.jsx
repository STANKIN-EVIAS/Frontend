import ClinicsPage from "pages/ClinicsPage/ClinicsPage.jsx";
import ContactsPage from "pages/ContactsPage/ContactsPage.jsx";
import HomePage from "pages/HomePage/HomePage.jsx";
import LoginPage from "pages/LoginPage/LoginPage.jsx";
import ReviewsPage from "pages/ReviewsPage/ReviewsPage.jsx";
import ServicesPage from "pages/ServicesPage/ServicesPage.jsx";
import SymptomsPage from "pages/SymptomsPage/SymptomsPage.jsx";
import UserProfilePage from "pages/UserProfilePage/UserProfilePage.jsx";
import { Route, Routes } from "react-router-dom";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/profile" element={<UserProfilePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/contacts" element={<ContactsPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/clinics" element={<ClinicsPage />} />
            <Route path="/symptoms" element={<SymptomsPage />} />
        </Routes>
    );
}
