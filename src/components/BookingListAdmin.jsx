import React, { useEffect, useState } from "react";
import axios from "axios";
import "./BookingListAdmin.css";

const API = import.meta.env.VITE_API_URL;
const BookingListAdmin = () => {
  const [bookings, setBookings] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  // 🔹 FETCH BOOKINGS
  const fetchBookings = async () => {
    try {
      const res = await axios.get(`${API}/api/bookings`);
      setBookings(res.data);
    } catch (error) {
      console.error("Error fetching bookings", error);
    }
  };

  // 🔥 DELETE BOOKING
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this booking?"
    );

    if (!confirmDelete) return;

    try {
      setLoadingId(id);
      await axios.delete(`${API}/api/bookings/${id}`);
      fetchBookings(); // refresh list
    } catch (error) {
      console.error("Error deleting booking", error);
      alert("Failed to delete booking");
    } finally {
      setLoadingId(null);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Bookings</h2>

      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
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
                <td>{new Date(b.createdAt).toLocaleString()}</td>
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
