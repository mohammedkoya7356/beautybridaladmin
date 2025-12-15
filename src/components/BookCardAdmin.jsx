import React, { useState, useEffect } from "react";
import axios from "axios";
import "./BookCardAdmin.css";

const API = import.meta.env.VITE_API_URL;
const BookCardAdmin = () => {
  const [cards, setCards] = useState([]);
  const [newCard, setNewCard] = useState({ title: "", price: "" });
  const [newImage, setNewImage] = useState(null);

  const [loadingId, setLoadingId] = useState(null);
  const [creating, setCreating] = useState(false); // 🔥 ADD LOADING

  const fetchCards = async () => {
    const res = await axios.get(`${API}/api/book-cards`);
    setCards(res.data);
  };

  useEffect(() => {
    fetchCards();
  }, []);

  // ================= CREATE CARD =================
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newImage) return alert("Image required");

    const form = new FormData();
    form.append("title", newCard.title);
    form.append("price", newCard.price);
    form.append("image", newImage);

    try {
      setCreating(true);
      await axios.post(`${API}/api/book-cards`, form);
      setNewCard({ title: "", price: "" });
      setNewImage(null);
      fetchCards();
    } catch {
      alert("Create failed");
    } finally {
      setCreating(false);
    }
  };

  // ================= UPDATE CARD =================
  const handleUpdate = async (id, index) => {
    const form = new FormData();
    form.append("title", cards[index].title);
    form.append("price", cards[index].price);

    if (cards[index].newImage) {
      form.append("image", cards[index].newImage);
    }

    try {
      setLoadingId(id);
      await axios.put(`${API}/api/book-cards/${id}`, form);
      fetchCards();
    } catch {
      alert("Update failed");
    } finally {
      setLoadingId(null);
    }
  };

  // ================= DELETE CARD =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this card?")) return;

    try {
      setLoadingId(id);
      await axios.delete(`${API}/api/book-cards/${id}`);
      fetchCards();
    } catch {
      alert("Delete failed");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="admin-container">
      <h2 className="admin-title">Manage Booking Cards</h2>

      {/* ================= CREATE CARD ================= */}
      <form className="create-card" onSubmit={handleCreate}>
        <h4>Add New Card</h4>

        <input
          type="text"
          placeholder="Title"
          value={newCard.title}
          onChange={(e) =>
            setNewCard({ ...newCard, title: e.target.value })
          }
          required
        />

        <input
          type="text"
          placeholder="Price"
          value={newCard.price}
          onChange={(e) =>
            setNewCard({ ...newCard, price: e.target.value })
          }
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setNewImage(e.target.files[0])}
          required
        />

        <button className="btn-primary" disabled={creating}>
          {creating ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              Loading…
            </>
          ) : (
            "Add Card"
          )}
        </button>
      </form>

      {/* ================= CARD LIST ================= */}
      <div className="card-grid">
        {cards.map((card, i) => (
          <div className="admin-card" key={card._id}>
            <img src={card.image} alt={card.title} />

            <label>Title</label>
            <input
              type="text"
              value={card.title}
              onChange={(e) => {
                const updated = [...cards];
                updated[i].title = e.target.value;
                setCards(updated);
              }}
            />

            <label>Price</label>
            <input
              type="text"
              value={card.price}
              onChange={(e) => {
                const updated = [...cards];
                updated[i].price = e.target.value;
                setCards(updated);
              }}
            />

            <label>Change Image</label>
            <input
              type="file"
              onChange={(e) => {
                const updated = [...cards];
                updated[i].newImage = e.target.files[0];
                setCards(updated);
              }}
            />

            <div className="card-actions">
              <button
                className="btn-update"
                disabled={loadingId === card._id}
                onClick={() => handleUpdate(card._id, i)}
              >
                {loadingId === card._id ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Updating…
                  </>
                ) : (
                  "Update"
                )}
              </button>

              <button
                className="btn-delete"
                disabled={loadingId === card._id}
                onClick={() => handleDelete(card._id)}
              >
                {loadingId === card._id ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Deleting…
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookCardAdmin;
