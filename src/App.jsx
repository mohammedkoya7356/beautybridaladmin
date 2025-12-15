import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "./admin/AdminLayout";
import BookCardAdmin from "./components/BookCardAdmin";
import BookingListAdmin from "./components/BookingListAdmin";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Redirect root to admin dashboard */}
        <Route path="/" element={<Navigate to="/admin" />} />

        {/* ADMIN DASHBOARD LAYOUT */}
        <Route path="/admin" element={<AdminLayout />}>

          {/* Default page inside dashboard */}
          <Route index element={<Navigate to="bookcards" />} />

          {/* Manage book cards */}
          <Route path="bookcards" element={<BookCardAdmin />} />

          {/* Manage bookings */}
          <Route path="bookings" element={<BookingListAdmin />} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
