import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "./CompletedBooking.css";

const CompletedBooking: React.FC = () => {
  const location = useLocation();
  const { pickupLocation, destinationLocation } = location.state || {}; // รับข้อมูลจากหน้า Booking และ Destination

  const [carType, setCarType] = useState<string>(""); // ประเภทรถ
  const [peopleCount, setPeopleCount] = useState<number>(1); // จำนวนคน

  const calculatePrice = (): string => {
    // คำนวณราคาตามจำนวนคนและประเภทรถ
    let pricePerPerson = 0;
    if (carType === "Sedan") pricePerPerson = 100;
    if (carType === "SUV") pricePerPerson = 150;
    if (carType === "Van") pricePerPerson = 200;

    return (pricePerPerson * peopleCount).toFixed(2);
  };

  const handleBooking = () => {
    // เมื่อผู้ใช้กด "จอง"
    console.log({
      pickupLocation,
      destinationLocation,
      carType,
      peopleCount,
      totalPrice: calculatePrice(),
    });
    alert("จองสำเร็จ!"); // หรือจะนำไปใช้งานกับ backend
  };

  return (
    <div className="completed-container">

      {/* Content Section */}
      <div className="completed-content">
        <div className="content-row">
          <p>
            <strong>จุดเริ่มต้น:</strong> {pickupLocation || "ไม่ระบุ"}
          </p>
          <p>
            <strong>จุดปลายทาง:</strong> {destinationLocation || "ไม่ระบุ"}
          </p>
        </div>

        {/* ส่วนเลือกประเภทรถและจำนวนคน */}
<div className="content-row-wrapper">
  <div className="content-row-header">
    <div className="header-item">ประเภทรถ</div>
    <div className="header-item">จำนวนคน</div>
    <div className="header-item">ราคา</div>
  </div>
</div>


        <div className="content-row">
          {/* ตัวเลือกประเภทรถ */}
          <div className="content-item">
            <select
              value={carType}
              onChange={(e) => setCarType(e.target.value)}
              className="content-select"
            >
              <option value="">เลือกประเภทรถ</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Van">Van</option>
            </select>
          </div>

          {/* ตัวเลือกจำนวนคน */}
          <div className="content-item">
            <select
              value={peopleCount}
              onChange={(e) => setPeopleCount(Number(e.target.value))}
              className="content-select"
            >
              <option value={1}>1 คน</option>
              <option value={2}>2 คน</option>
              <option value={3}>3 คน</option>
              <option value={4}>4 คน</option>
              <option value={5}>5 คน</option>
            </select>
          </div>

          {/* แสดงราคา */}
          <div className="content-item">
            <input
              className="content-input"
              type="text"
              value={`${calculatePrice()} บาท`}
              disabled
            />
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="completed-footer">
        <button className="complete-button" onClick={handleBooking}>
          จอง Cabana car
        </button>
      </div>
    </div>
  );
};

export default CompletedBooking;
