import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // นำเข้า useNavigate
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import './booking.css'; // CSS ที่กำหนด

interface BookingDetails {
  pickupLocation: string;
}

const Booking: React.FC = () => {
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({
    pickupLocation: '',
  });

  const [position, setPosition] = useState<[number, number] | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  const navigate = useNavigate(); // ใช้ useNavigate เพื่อเปลี่ยนหน้า

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
    setBookingDetails({
      ...bookingDetails,
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
    setBookingDetails({ pickupLocation: location });

    // เปลี่ยนเส้นทางไปยังหน้า Pickup
    navigate('/destination', { state: { pickupLocation: location, coords } });
  };

  return (
    <div className="pickup-booking-container">
      <form>
        <div className="form-group">
          <div className="input-container">
            <i className="search-icon">&#128269;</i>
            <input
              type="text"
              name="pickupLocation"
              value={bookingDetails.pickupLocation}
              onChange={handleInputChange}
              placeholder="Where to ?"
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
            <p>กำลังดึงข้อมูลตำแหน่ง...</p>
          )}
        </div>
      </form>

      {/* ส่วนแสดงรายการสถานที่ */}
      <div className="location-list">
        <div
          className="location-item"
          onClick={() => handleLocationClick('มหาวิทยาลัยเทคโนโลยีสุรนารี', [14.880055, 102.015152])}
        >
          <i className="location-icon">📍</i>
          มหาวิทยาลัยเทคโนโลยีสุรนารี
        </div>
        <div
          className="location-item"
          onClick={() => handleLocationClick('เดอะมอลล์โคราช', [14.972245, 102.083462])}
        >
          <i className="location-icon">📍</i>
          เดอะมอลล์โคราช
        </div>
        <div
          className="location-item"
          onClick={() => handleLocationClick('โรงเหล้ามิตรภาพ โคราช', [14.899326, 102.056156])}
        >
          <i className="location-icon">📍</i>
          โรงเหล้ามิตรภาพ โคราช
        </div>
      </div>
      {/* กล่องสำหรับการกดไปหน้าจองล่วงหน้า */}
      <div className="advancebookingcontainer" onClick={() => navigate('/advance-booking')}>
        <div className="advance-booking-button">
          จองล่วงหน้า
        </div>
      </div>
    </div>
  );
};

export default Booking;
