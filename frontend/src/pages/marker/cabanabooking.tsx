import React, { useState } from "react";
import "./CabanaBooking.css";

const CabanaBooking: React.FC = () => {
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>("CabanaCar");

  const handleSelectVehicle = (vehicle: string) => {
    setSelectedVehicle(vehicle);
  };

  return (
    <div className="booking-container">
      <div className="locations">
        <div className="location">
          <span>จุดเริ่มต้น</span>
        </div>
        <div className="location">
          <span>จุดปลายทาง</span>
        </div>
      </div>

      <div className="vehicles">
        <div
          className={`vehicle-item ${selectedVehicle === "CabanaCar" ? "selected" : ""}`}
          onClick={() => handleSelectVehicle("CabanaCar")}
        >
          <div className="vehicle-info">
            <img src="/car-icon.png" alt="Car" className="vehicle-icon" />
            <span>CabanaCar</span>
            <span className="capacity">x4</span>
          </div>
          <div className="vehicle-price">฿120</div>
        </div>

        <div
          className={`vehicle-item ${selectedVehicle === "Cananabike" ? "selected" : ""}`}
          onClick={() => handleSelectVehicle("Cananabike")}
        >
          <div className="vehicle-info">
            <img src="/bike-icon.png" alt="Bike" className="vehicle-icon" />
            <span>Cananabike</span>
            <span className="capacity">x1</span>
          </div>
          <div className="vehicle-price">฿50</div>
        </div>
      </div>

      <button className="booking-button">จอง {selectedVehicle}</button>
    </div>
  );
};

export default CabanaBooking;
