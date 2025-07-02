import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

function Hotels() {
  const [searchText, setSearchText] = useState("");
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [comments, setComments] = useState([]);
  const [averageRating, setAverageRating] = useState("N/A");
  const hotelsEndRef = useRef(null);

  const isLoggedIn = true;

  const scrollToBottom = () => {
    hotelsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [hotels]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchText.trim()) return;

    setLoading(true);
    setSearchPerformed(false);

    try {
      const response = await axios.post("https://localhost:5000/api/v1/ai/ask", {
        question: searchText,
      });

      setHotels(response.data.hotels || []);
      setSearchPerformed(true);
    } catch (error) {
      console.error("AI agent error:", error);
      alert("❌ An error occurred. AI agent or hotel API could not be reached.");
    }

    setLoading(false);
  };

  const handleViewDetails = async (hotel) => {
    setSelectedHotel(hotel);

    try {
      const res = await axios.get(
        `https://localhost:5000/api/v1/comments/hotel/${hotel.id}`
      );

      console.log("Comments API response:", res.data);

      setComments(res.data.comments || []);
      setAverageRating(res.data.averageRating || "N/A");
    } catch (error) {
      console.error("Comments fetch error", error);
      setComments([]);
      setAverageRating("N/A");
    }
  };

  const handleBookHotel = async (room) => {
    try {
      const payload = {
        roomId: room.id,
        startDate: "2025-07-10T14:00:00Z",
        endDate: "2025-07-15T12:00:00Z",
        numberOfPeople: 2,
        userId: 1
      };

      console.log("Booking payload:", payload);

      const res = await axios.post(
        "https://localhost:5000/api/v1/booking",
        payload
      );

      alert("✅ Reservation completed!");
      console.log("Booking response:", res.data);
    } catch (error) {
      console.error("Booking error", error.response?.data || error);
      alert("❌ Reservation failed.");
    }
  };

  const discountedPrice = (price) => (price * 0.85).toFixed(2);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #7e22ce, #4c1d95)",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "3rem",
        fontFamily: "Arial, sans-serif",
        fontSize: "1.2rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          background: "rgba(255, 255, 255, 0.15)",
          borderRadius: "20px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
          padding: "35px",
          backdropFilter: "blur(15px)",
        }}
      >
        <header style={{ textAlign: "center", marginBottom: "30px" }}>
          <h1 style={{ fontSize: "2.2rem", fontWeight: "bold", color: "#fff" }}>
            AI Hotel Finder
          </h1>
          <p style={{ fontSize: "1rem", color: "#e5e5e5" }}>
            Type city, number of people, and dates to find hotels.
          </p>
        </header>

        <form onSubmit={handleSearch} style={{ marginBottom: "30px" }}>
          <input
            type="text"
            placeholder="e.g. Search hotels in Istanbul for 2 people"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{
              width: "100%",
              padding: "15px",
              fontSize: "1.1rem",
              border: "none",
              borderRadius: "10px",
              marginBottom: "20px",
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "15px",
              fontSize: "1.1rem",
              background: "linear-gradient(90deg, #9333ea, #6d28d9)",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
            }}
          >
            {loading ? "Searching..." : "Search Hotels"}
          </button>
        </form>

        {searchPerformed && (
          <div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "10px" }}>
              Available Hotels
            </h3>
            {hotels.length > 0 ? (
              <ul style={{ listStyle: "none", padding: 0 }}>
                {hotels.map((hotel) => (
                  <li
                    key={hotel.id}
                    style={{
                      background: "rgba(255,255,255,0.2)",
                      padding: "15px",
                      borderRadius: "10px",
                      marginBottom: "10px",
                    }}
                  >
                    <strong>{hotel.name}</strong> – {hotel.city}
                    <div>{hotel.description}</div>
                    {hotel.rooms.map((room) => (
                      <div key={room.id}>
                        ◦ {room.type} –{" "}
                        {isLoggedIn ? (
                          <>
                            <s>{room.price}₺</s> {discountedPrice(room.price)}₺ (%15 off)
                          </>
                        ) : (
                          <>{room.price}₺</>
                        )}
                        – {room.capacity} people

                        <button
                          onClick={() => handleBookHotel(room)}
                          style={{
                            marginLeft: "10px",
                            padding: "5px 10px",
                            background: "#22c55e",
                            border: "none",
                            borderRadius: "5px",
                            color: "#fff",
                            cursor: "pointer",
                          }}
                        >
                          Make Reservation
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => handleViewDetails(hotel)}
                      style={{
                        marginTop: "10px",
                        padding: "8px 12px",
                        background: "#6d28d9",
                        border: "none",
                        borderRadius: "8px",
                        color: "#fff",
                        cursor: "pointer",
                      }}
                    >
                      View Details
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: "#e5e5e5" }}>No hotels found</p>
            )}
          </div>
        )}

        {selectedHotel && (
          <div
            style={{
              marginTop: "30px",
              padding: "20px",
              background: "rgba(0,0,0,0.3)",
              borderRadius: "10px",
            }}
          >
            <h3>{selectedHotel.name} Details</h3>
            <p>{selectedHotel.description}</p>

            <h4>Average Rating: {averageRating} ⭐</h4>

            <h4>Comments</h4>
            {comments.length > 0 ? (
              comments.map((c) => (
                <div key={c.id.timestamp}>
                  <strong>{c.username}</strong>: {c.text} ({c.rating}⭐)
                </div>
              ))
            ) : (
              <p>No comments found</p>
            )}

            <button
              onClick={() => setSelectedHotel(null)}
              style={{
                marginTop: "10px",
                padding: "8px 12px",
                background: "#9333ea",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        )}

        <div ref={hotelsEndRef} />
      </div>
    </div>
  );
}

export default Hotels;
