import AuthRoutes from "components/Auth/AuthRoutes.jsx";
import ClinicsRoutes from "components/Clinics/ClinicsRoutes";
import MainRoutes from "components/Main/MainRoutes.jsx";
import PetsRoutes from "components/Pets/PetsRoutes.jsx";
import ReviewsRoutes from "components/Reviews/ReviewsRoutes.jsx";
import ServicesRoutes from "components/Services/ServicesRoutes.jsx";
import UsersRoutes from "components/Users/UsersRoutes.jsx";
import CalendarRoutes from "components/Calendar/CalendarRoutes.jsx";

import { Routes } from "react-router-dom";

export default function AppRoutes() {
  return (
    <Routes>
      {UsersRoutes()}
      {MainRoutes()}
      {AuthRoutes()}
      {ReviewsRoutes()}
      {CalendarRoutes()}
      {ServicesRoutes()}
      {ClinicsRoutes()}
      {PetsRoutes()}
    </Routes>
  );
}
