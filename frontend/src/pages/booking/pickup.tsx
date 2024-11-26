import React from "react";
import { useNavigate } from "react-router-dom";
import "./Pickup.css";

const Pickup: React.FC = () => {
  const navigate = useNavigate(); // ใช้ hook ของ React Router

  const handleServiceButtonClick = () => {
    navigate("/completed-booking"); // พาผู้ใช้งานไปที่หน้า CompletedBooking
  };

  return (
    <div className="pickup-container">
      {/* Header Section */}
      <div className="pickup-header">
        <img
          src="https://via.placeholder.com/1200x400" // เปลี่ยน URL เป็นภาพจริง
          alt="Map Background"
          className="header-image"
        />
        <div className="search-bar">
          <input
            type="text"
            placeholder="เลือกจุดรับ"
            className="search-input"
          />
          <button className="search-button">
            <i className="fas fa-search"></i>
          </button>
        </div>
      </div>

      {/* Destination Section */}
      <div className="destination-section">
        <div className="destination-item">
          <i className="fas fa-map-marker-alt"></i>
          จุดหมายที่ 1
        </div>
        <div className="destination-item">
          <i className="fas fa-map-marker-alt"></i>
          จุดหมายที่ 2
        </div>
      </div>

      {/* Service Section */}
      <div className="service-section">
        <button className="service-button" onClick={handleServiceButtonClick}>
          จองจุดรับนี้
        </button>
      </div>
    </div>
  );
};

export default Pickup;
