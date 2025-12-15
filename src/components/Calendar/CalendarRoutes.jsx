import CalendarPage from "pages/Calendar/CalendarPage.jsx";
import React from "react";
import { Route } from "react-router-dom";

export default function CalendarRoutes() {
  return (
    <React.Fragment>
      <Route path="/calendar" element={<CalendarPage />} />
    </React.Fragment>
  );
}
