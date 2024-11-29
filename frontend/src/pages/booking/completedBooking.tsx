import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import L from "leaflet";
import "./CompletedBooking.css";

const CompletedBooking: React.FC = () => {
  const location = useLocation();
  const { pickupLocation, destinationLocation, pickupCoords, destinationCoords } =
    location.state || {}; // รับข้อมูลจาก Booking และ Destination

  const [carType, setCarType] = useState<string>(""); // ประเภทรถ
  const [peopleCount, setPeopleCount] = useState<number>(1); // จำนวนคน
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]); // เส้นทางระหว่างจุดเริ่มต้นและจุดปลายทาง

  // ฟังก์ชันคำนวณราคาตามจำนวนคนและประเภทรถ
  const calculatePrice = (): string => {
    let pricePerPerson = 0;
    if (carType === "Sedan") pricePerPerson = 100;
    if (carType === "SUV") pricePerPerson = 150;
    if (carType === "Van") pricePerPerson = 200;

    return (pricePerPerson * peopleCount).toFixed(2);
  };

  // ฟังก์ชันเรียก OpenRouteService API เพื่อดึงข้อมูลเส้นทาง
  useEffect(() => {
    const fetchRoute = async () => {
      if (pickupCoords && destinationCoords) {
        try {
          const apiKey = "your_openrouteservice_api_key"; // ใส่ API Key ของคุณ
          const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${pickupCoords[1]},${pickupCoords[0]}&end=${destinationCoords[1]},${destinationCoords[0]}`;
          const response = await fetch(url);
          const data = await response.json();

          // ดึงเส้นทางจาก API
          const extractedRoute = data.features[0].geometry.coordinates.map(
            (coord: [number, number]) => [coord[1], coord[0]]
          ); // แปลง [lon, lat] เป็น [lat, lon]
          setRouteCoords(extractedRoute);
        } catch (error) {
          console.error("Error fetching route:", error);
        }
      }
    };

    fetchRoute();
  }, [pickupCoords, destinationCoords]);

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
      <h2>สรุปการเดินทาง</h2>

      {/* แผนที่แสดงเส้นทาง */}
      <div className="map-container">
        {pickupCoords && destinationCoords ? (
          <MapContainer
            center={pickupCoords}
            zoom={13}
            
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            {/* ปักหมุดจุดเริ่มต้น */}
            <Marker
              position={pickupCoords}
              icon={new L.Icon({
                iconUrl: "https://leafletjs.com/examples/custom-icons/leaf-green.png",
                iconSize: [30, 40],
              })}
            />
            {/* ปักหมุดจุดปลายทาง */}
            <Marker
              position={destinationCoords}
              icon={new L.Icon({
                iconUrl: "https://leafletjs.com/examples/custom-icons/leaf-red.png",
                iconSize: [30, 40],
              })}
            />
            {/* เส้นทางระหว่างจุด */}
            {routeCoords.length > 0 && <Polyline positions={routeCoords} color="blue" />}
          </MapContainer>
        ) : (
          <p>กำลังโหลดแผนที่...</p>
        )}
      </div>

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
