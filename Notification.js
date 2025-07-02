import React from "react";
import api from "../api";

function Notification() {
  const handleCheckCapacities = async () => {
    try {
      const response = await api.get("/notification/check-capacities");
      alert(response.data);
    } catch (error) {
      console.error("Error checking capacities:", error);
      alert("Failed to check capacities.");
    }
  };

  return (
    <div>
      <h2>Notifications</h2>
      <button onClick={handleCheckCapacities}>
        Check Hotel Capacities and Notify Admins
      </button>
    </div>
  );
}

export default Notification;
