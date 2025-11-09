import ReviewsPage from "pages/Main/ReviewsPage.jsx";
import React from "react";
import { Route } from "react-router-dom";

export default function ReviewsRoutes() {
  return (
    <React.Fragment>
      <Route path="/reviews" element={<ReviewsPage />} />
    </React.Fragment>
  );
}
