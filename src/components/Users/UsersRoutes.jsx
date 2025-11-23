import UserProfilePage from "pages/Users/UserProfilePage.jsx";
import React from "react";
import { Route } from "react-router-dom";

export default function UsersRoutes() {
  return (
    <React.Fragment>
      <Route path="/profile" element={<UserProfilePage />} />
    </React.Fragment>
  );
}
