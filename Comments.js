import React, { useEffect, useState } from "react";
import api from "../api";

function Comments() {
  const [comments, setComments] = useState([]);
  const [form, setForm] = useState({
    hotelId: "",
    username: "",
    text: ""
  });

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await api.get("/comments");
        setComments(response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    fetchComments();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/comments", form);
      alert("Comment added successfully");
      setForm({ hotelId: "", username: "", text: "" });
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Failed to add comment");
    }
  };

  return (
    <div>
      <h2>Comments</h2>
      <ul>
        {comments.map((c) => (
          <li key={c.id}>{c.username}: {c.text}</li>
        ))}
      </ul>

      <h3>Add Comment</h3>
      <form onSubmit={handleSubmit}>
        <input name="hotelId" placeholder="Hotel ID" value={form.hotelId} onChange={handleChange} required />
        <input name="username" placeholder="Username" value={form.username} onChange={handleChange} required />
        <textarea name="text" placeholder="Comment" value={form.text} onChange={handleChange} required />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Comments;
