import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import './booking.css';

interface BookingDetails {
  pickupLocation: string;
}

const Booking: React.FC = () => {
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({
    pickupLocation: '',
  });

  const [position, setPosition] = useState<[number, number] | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const navigate = useNavigate();

  // ดึงข้อมูลตำแหน่งผู้ใช้จาก geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        () => {
          setUserLocation([13.736717, 100.523186]); // Default location: Bangkok
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

  // ค้นหาตำแหน่งจากข้อความที่ผู้ใช้กรอก
  const handleSearchLocation = async () => {
    const searchQuery = bookingDetails.pickupLocation;
    if (searchQuery) {
      try {
        /*const query = encodeURIComponent(`${searchQuery}, ประเทศไทย`);
      const result = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${query}&key=aa77b85494e54325a94447699aa355cf`
      ); */
        const result = await fetch(
          `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(searchQuery)}&key=aa77b85494e54325a94447699aa355cf`
        );
        const data = await result.json();
        console.log(data); // ตรวจสอบผลลัพธ์ API
        console.log("Search Query:", searchQuery);
        console.log("API Response Results:", data.results);

  
        if (data.results && data.results.length > 0) {
          const { lat, lng } = data.results[0].geometry;
          setPosition([lat, lng]);
          setBookingDetails({ pickupLocation: searchQuery });
        } else {
          alert("ไม่พบสถานที่ที่ค้นหา กรุณาลองระบุชื่อสถานที่ให้ชัดเจนขึ้น เช่น จังหวัดหรือประเทศ");
        }
      } catch (error) {
        console.error("Error fetching location data:", error);
        alert("เกิดข้อผิดพลาดในการเรียก API กรุณาลองใหม่");
      }
    }
  };
  

  // เมื่อคลิกเลือกสถานที่จากรายการ
  const handleLocationClick = (location: string, coords: [number, number]) => {
    setPosition(coords);
    setBookingDetails({ pickupLocation: location });
  };

  const FlyToLocation: React.FC = () => {
    const map = useMap();

    useEffect(() => {
      if (position) {
        map.flyTo(position, 13, { duration: 1.5 }); // ทำให้แผนที่เลื่อนไปตำแหน่งที่ใหม่
      } else if (userLocation) {
        map.flyTo(userLocation, 13, { duration: 1.5 });
      }
    }, [position, userLocation, map]); // ทำให้แผนที่อัปเดตเมื่อ position หรือ userLocation เปลี่ยนแปลง

    return position ? (
      <Marker
        position={position}
        icon={new L.Icon({
          iconUrl: 'รถถถถ.jpeg', // ธงไทย
          iconSize: [38, 95], // ขนาดของธง
          iconAnchor: [19, 95], // จุดที่ธงยึดอยู่บนแผนที่
        })}
      />
    ) : null;
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
            <button type="button" onClick={handleSearchLocation}>
              ค้นหาตำแหน่ง
            </button>
          </div>
        </div>

        <div className="map-container">
          {userLocation ? (
            <MapContainer center={userLocation} zoom={19}>
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

      <div className="advancebookingcontainer" onClick={() => navigate('/map')}>
        <div className="advance-booking-button">
          จองล่วงหน้า
        </div>
      </div>
    </div>
  );
};

export default Booking;
