import React from "react";
import { Link, Outlet } from "react-router-dom";
import "./admin.css";

const AdminLayout = () => {
  return (
    <div className="admin-container">

      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">Admin Panel</h2>
        <nav>
          <Link to="bookcards">Book Cards</Link>
          <Link to="bookings">Customer </Link>
        </nav>
      </aside>

      {/* Content area */}
      <main className="content">
        <Outlet />   {/* VERY IMPORTANT */}
      </main>

    </div>
  );
};

export default AdminLayout;
