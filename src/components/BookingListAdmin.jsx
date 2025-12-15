import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./BookingListAdmin.css";

// ✅ PRODUCTION API ONLY (NO localhost)
const API = import.meta.env.VITE_API_URL;

const BookingListAdmin = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null);
  const [error, setError] = useState("");

  // 🔹 FETCH BOOKINGS
  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(`${API}/api/bookings`);

      // Safety check
      const data = Array.isArray(res.data) ? res.data : [];
      setBookings(data);
    } catch (err) {
      console.error("❌ Error fetching bookings:", err);
      setError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔥 DELETE BOOKING
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this booking?"
    );
    if (!confirmDelete) return;

    try {
      setLoadingId(id);
      await axios.delete(`${API}/api/bookings/${id}`);
      fetchBookings();
    } catch (err) {
      console.error("❌ Error deleting booking:", err);
      alert("Failed to delete booking");
    } finally {
      setLoadingId(null);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return (
    <div className="container mt-4">
      <h2>Bookings</h2>

      {/* 🔄 Loading */}
      {loading && <p>Loading bookings...</p>}

      {/* ❌ Error */}
      {!loading && error && <p className="text-danger">{error}</p>}

      {/* 📭 Empty */}
      {!loading && bookings.length === 0 && !error && (
        <p>No bookings found.</p>
      )}

      {/* 📋 Table */}
      {!loading && bookings.length > 0 && (
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>Product</th>
              <th>Name</th>
              <th>Address</th>
              <th>Phone</th>
              <th>Date</th>
              <th>Booked At</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((b) => (
              <tr key={b._id}>
                <td>
                  {b.productTitle}
                  <br />
                  ₹{b.productPrice}
                </td>
                <td>{b.name}</td>
                <td>{b.address}</td>
                <td>{b.phone}</td>
                <td>{b.date}</td>
                <td>
                  {b.createdAt
                    ? new Date(b.createdAt).toLocaleString()
                    : "-"}
                </td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(b._id)}
                    disabled={loadingId === b._id}
                  >
                    {loadingId === b._id ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BookingListAdmin;
