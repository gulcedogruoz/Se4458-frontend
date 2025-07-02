import React, { useState } from "react";
import api from "../api";

function Booking() {
  const [form, setForm] = useState({
    userId: "",
    roomId: "",
    startDate: "",
    endDate: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/bookings", form);
      alert("Booking created successfully");
      setForm({ userId: "", roomId: "", startDate: "", endDate: "" });
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("Failed to create booking");
    }
  };

  return (
    <div>
      <h2>Create Booking</h2>
      <form onSubmit={handleSubmit}>
        <input name="userId" placeholder="User ID" value={form.userId} onChange={handleChange} required />
        <input name="roomId" placeholder="Room ID" value={form.roomId} onChange={handleChange} required />
        <input name="startDate" type="date" value={form.startDate} onChange={handleChange} required />
        <input name="endDate" type="date" value={form.endDate} onChange={handleChange} required />
        <button type="submit">Book</button>
      </form>
    </div>
  );
}

export default Booking;
