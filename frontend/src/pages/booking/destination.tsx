import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // เพิ่ม useLocation
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import './destination.css'; // CSS เฉพาะของ Destination

interface DestinationDetails {
  destinationLocation: string;
}

const Destination: React.FC = () => {
  const [destinationDetails, setDestinationDetails] = useState<DestinationDetails>({
    destinationLocation: '',
  });

  const [position, setPosition] = useState<[number, number] | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  const navigate = useNavigate();
  const location = useLocation(); // รับข้อมูลจาก state ของหน้าก่อนหน้า

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
      setUserLocation([13.736717, 100.523186]);
    }
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDestinationDetails({
      ...destinationDetails,
      [event.target.name]: event.target.value,
    });
  };

  const FlyToLocation: React.FC = () => {
    const map = useMap();

    useEffect(() => {
      if (position) {
        map.flyTo(position, 13, {
          duration: 1.5,
        });
      }
    }, [position, map]);

    return position ? (
      <Marker
        position={position}
        icon={new L.Icon({
          iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-green.png',
          iconSize: [38, 95],
        })}
      />
    ) : null;
  };

  const handleLocationClick = (location: string, coords: [number, number]) => {
    setPosition(coords);
    setDestinationDetails({ destinationLocation: location });

    // เปลี่ยนเส้นทางกลับไปหน้าสรุป หรืออื่น ๆ
    navigate('/summary', { state: { destinationLocation: location, coords } });
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
          </div>
        </div>

        <div className="map-container">
          {userLocation ? (
            <MapContainer center={userLocation} zoom={13}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
              />
              <FlyToLocation />
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
          onClick={() => handleLocationClick('Central World', [13.746544, 100.539363])}
        >
          <i className="location-icon">📍</i>
          Central World
        </div>
        <div
          className="location-item"
          onClick={() => handleLocationClick('MBK Center', [13.745008, 100.529620])}
        >
          <i className="location-icon">📍</i>
          MBK Center
        </div>
        <div
          className="location-item"
          onClick={() => handleLocationClick('Chatuchak Market', [13.798599, 100.553114])}
        >
          <i className="location-icon">📍</i>
          Chatuchak Market
        </div>
      </div>
      {/* ปุ่มดำเนินการต่อ */}
      <div className="advance-booking-container" onClick={() => navigate('/completed-booking')}>
        <div className="advance-booking-button">
          Confirm Destination
        </div>
      </div>
    </div>
  );
};

export default Destination;
