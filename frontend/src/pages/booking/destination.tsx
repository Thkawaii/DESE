import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "./destination.css";

interface DestinationDetails {
  destinationLocation: string;
}

const Destination: React.FC = () => {
  const [destinationDetails, setDestinationDetails] = useState<DestinationDetails>({
    destinationLocation: "",
  });
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [position, setPosition] = useState<[number, number] | null>(null);

  const navigate = useNavigate();

  // ดึงตำแหน่งผู้ใช้
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        () => {
          setUserLocation([13.736717, 100.523186]); // Default: Bangkok
        }
      );
    } else {
      setUserLocation([13.736717, 100.523186]); // Default: Bangkok
    }
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDestinationDetails({
      ...destinationDetails,
      [event.target.name]: event.target.value,
    });
  };

  // ฟังก์ชันจัดการการค้นหาสถานที่
  const handleSearchLocation = async () => {
    const searchQuery = destinationDetails.destinationLocation;
    if (searchQuery) {
      try {
        const result = await fetch(
          `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(searchQuery)}&key=aa77b85494e54325a94447699aa355cf`
        );
        const data = await result.json();
        if (data.results && data.results.length > 0) {
          const { lat, lng } = data.results[0].geometry;
          setPosition([lat, lng]);
        } else {
          alert("ไม่พบสถานที่ที่ค้นหา กรุณาระบุชื่อสถานที่ให้ชัดเจนขึ้น เช่น จังหวัดหรือประเทศ");
        }
      } catch (error) {
        console.error("Error fetching location data:", error);
        alert("เกิดข้อผิดพลาดในการค้นหาสถานที่");
      }
    }
  };

  // จัดการการคลิกบนแผนที่เพื่อเลือกตำแหน่ง
  const handleMapClick = (e: any) => {
    setPosition([e.latlng.lat, e.latlng.lng]);
    setDestinationDetails({ destinationLocation: `Lat: ${e.latlng.lat}, Lng: ${e.latlng.lng}` });
  };

  const handleLocationClick = (location: string, coords: [number, number]) => {
    setPosition(coords);
    setDestinationDetails({ destinationLocation: location });
  };

  const handleConfirm = () => {
    if (position) {
      navigate("/completed-booking", { state: { destinationDetails, position } });
    } else {
      alert("กรุณาเลือกจุดปลายทาง");
    }
  };

  // ฟังก์ชันสำหรับเลื่อนแผนที่เมื่อ position เปลี่ยน
  const FlyToLocation = () => {
    const map = useMap();

    useEffect(() => {
      if (position) {
        map.flyTo(position, 13, { duration: 1.5 });
      }
    }, [position, map]);

    return null;
  };

  return (
    <div className="destination-container">
      <form>
        <div className="form-group">
          <div className="input-container">
            <i className="search-icon">&#128269;</i>
            <input
              type="text"
              name="destinationLocation"
              value={destinationDetails.destinationLocation}
              onChange={handleInputChange}
              placeholder="Enter your destination"
            />
            <button type="button" onClick={handleSearchLocation}>
              ค้นหาตำแหน่ง
            </button>
          </div>
        </div>

        <div className="map-container">
          {userLocation ? (
            <MapContainer center={userLocation} zoom={13} style={{ height: "400px" }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              <FlyToLocation />
              {position && (
                <Marker
                  position={position}
                  icon={new L.Icon({
                    iconUrl: "รถถถถ.jpeg",
                    iconSize: [30, 40],
                  })}
                />
              )}
            </MapContainer>
          ) : (
            <p>Loading location...</p>
          )}
        </div>
      </form>

      {/* ส่วนแสดงรายการปลายทาง */}
      <div className="location-list">
        <div
          className="location-item"
          onClick={() => handleLocationClick("Central World", [13.746544, 100.539363])}
        >
          <i className="location-icon">📍</i>
          Central World
        </div>
        <div
          className="location-item"
          onClick={() => handleLocationClick("MBK Center", [13.745008, 100.529620])}
        >
          <i className="location-icon">📍</i>
          MBK Center
        </div>
        <div
          className="location-item"
          onClick={() => handleLocationClick("Chatuchak Market", [13.798599, 100.553114])}
        >
          <i className="location-icon">📍</i>
          Chatuchak Market
        </div>
      </div>

      {/* ปุ่มยืนยัน */}
      <div className="confirm-destination-container">
        <button className="confirm-destination-button" onClick={handleConfirm}>
          Confirm Destination
        </button>
      </div>
    </div>
  );
};

export default Destination;
