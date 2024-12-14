import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useNavigate, useLocation } from 'react-router-dom';
import './MapDestination.css'; // นำเข้าไฟล์ CSS
// นำเข้าฟังก์ชันจาก service/https/index.tsx
import { sendDataDestinationToBackend } from '../../services/https'; // ปรับเส้นทางให้ตรงกับที่ตั้งไฟล์จริง


const containerStyle = {
  width: '100%',
  height: '400px',
};

const searchContainerStyle = {
  width: '100%',
  padding: '10px',
  marginTop: '10px',
  backgroundColor: '#fff',
  position: 'absolute',
  bottom: '10px',
  left: '0',
  zIndex: '1000',
  top: '80%',
};

const MapDestination: React.FC = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null); // ตำแหน่งปัจจุบัน
  const [destinationLocation, setDestinationLocation] = useState<{ lat: number; lng: number; name: string } | null>(null); // จุดหมายปลายทาง
  const [searchText, setSearchText] = useState<string>('');
  const [nearbyPlaces, setNearbyPlaces] = useState<any[]>([]); // รายการสถานที่ใกล้เคียง
  const [map, setMap] = useState<any>(null); // ใช้เก็บ map instance เพื่อใช้ในการเลื่อนแผนที่
  const navigate = useNavigate(); // ใช้ navigate สำหรับเปลี่ยนหน้า

  const locationFromMapComponent = useLocation();
const pickupLocation = locationFromMapComponent.state?.pickupLocation || null;
const startLocationId = locationFromMapComponent.state?.startLocationId || null;
  // เช็คว่ามีค่า pickupLocation หรือไม่
  React.useEffect(() => {
    if (!pickupLocation) {
      console.error('Pickup location is missing!');
    } else {
      console.log('Pickup location received:', pickupLocation);
      console.log('Start Location ID received:', startLocationId);
      setLocation(pickupLocation); // ตั้งค่า location ด้วย pickupLocation
    }
  }, [pickupLocation, startLocationId]);
  
  // ฟังก์ชันค้นหาสถานที่ใกล้เคียงจากตำแหน่งผู้ใช้
  const fetchNearbyPlaces = (location: { lat: number; lng: number }) => {
    const placesService = new window.google.maps.places.PlacesService(
      document.createElement('div')
    );

    const request = {
      location: new window.google.maps.LatLng(location.lat, location.lng),
      radius: 5000, // ระยะทางรัศมี 5 กิโลเมตร
      type: ['restaurant', 'park', 'shopping_mall'], // กำหนดประเภทสถานที่ที่ต้องการค้นหา
    };

    placesService.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
        setNearbyPlaces(results.slice(0, 5)); // ตั้งค่ารายการสถานที่ใกล้เคียง แสดงแค่ 5 รายการ
      } else {
        console.error('Error fetching nearby places:', status);
      }
    });
  };

  // ฟังก์ชันสำหรับเลือกจุดหมายปลายทางเมื่อผู้ใช้คลิกที่แผนที่
  const handleMapClick = (event: any) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    
    // ใช้ reverse geocoding เพื่อดึงชื่อสถานที่จากพิกัด
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === window.google.maps.GeocoderStatus.OK && results.length > 0) {
        const placeName = results[0].formatted_address;
        setDestinationLocation({ lat, lng, name: placeName }); // ตั้งค่าตำแหน่งจุดหมายปลายทาง
      }
    });
  };

  // ฟังก์ชันสำหรับการค้นหาสถานที่
  const handlePlaceSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
    if (event.target.value === '') {
      setNearbyPlaces([]); // รีเซ็ตสถานที่ใกล้เคียงเมื่อไม่มีการค้นหา
      return;
    }

    // สร้าง google.maps.PlacesService
    const placesService = new window.google.maps.places.PlacesService(document.createElement('div'));
    const request = {
      query: event.target.value,
      fields: ['place_id', 'geometry', 'name'],
    };

    placesService.findPlaceFromQuery(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results.length > 0) {
        const firstResult = results[0];
        const location = firstResult.geometry.location;
        setDestinationLocation({ name: firstResult.name, lat: location.lat(), lng: location.lng() }); // อัปเดตข้อมูลจุดหมายปลายทาง
      }
    });
  };

  
const [destinationId, setDestinationId] = React.useState<number | null>(null);

const handleDestinationSubmit = async () => {
  console.log("handleDestinationSubmit called!"); // เพิ่ม log เพื่อตรวจสอบ
  console.log("Pickup Location:", location);  // ตรวจสอบว่า pickupLocation ถูกส่งมาหรือไม่
  console.log("Destination Location:", destinationLocation);  // ตรวจสอบว่า destinationLocation ถูกส่งมาหรือไม่
  
  if (destinationLocation) {
    // ส่งข้อมูลไปที่ backend ผ่านฟังก์ชัน sendDataDestinationToBackend
    try {
      const destinationId = await sendDataDestinationToBackend(destinationLocation);
      setDestinationId(destinationId); // เก็บ ID ใน state
      console.log('Destination ID:', destinationId); // Log destination ID

      // ส่งข้อมูลไปหน้า maproute โดยใช้ navigate
      navigate('/maproute', { state: { pickupLocation: location, destinationLocation, destinationId ,startLocationId } });

    } catch (error) {
      console.error('Error sending destination to backend:', error);
    }
  } else {
    console.error('ยังไม่ได้เลือกจุดหมายปลายทาง');
  }
};

  

  if (!location) return <div>กำลังโหลดแผนที่...</div>;

  return (
    <div style={{ position: 'relative' }}>
      <LoadScript googleMapsApiKey="api_map" libraries={['places']}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={location}
          zoom={15}
          onLoad={(mapInstance) => setMap(mapInstance)} // เก็บ map instance เพื่อใช้เลื่อนแผนที่
          onClick={handleMapClick} // เมื่อคลิกที่แผนที่ ให้เลือกจุดหมายปลายทาง
        >
          {/* แสดง Marker ที่ตำแหน่งของผู้ใช้ */}
          <Marker position={location} />

          {/* แสดง Marker ที่ตำแหน่งจุดหมายปลายทาง */}
          {destinationLocation && <Marker position={{ lat: destinationLocation.lat, lng: destinationLocation.lng }} />}
        </GoogleMap>
      </LoadScript>

      {/* ช่องค้นหาสถานที่ */}
      <div style={{ ...searchContainerStyle, marginTop: '80px' }}>
        <input
          type="text"
          value={searchText}
          onChange={handlePlaceSearch}
          placeholder="ค้นหาสถานที่"
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* แสดงรายการสถานที่ใกล้เคียง */}
      <div className="list-place">
        <ul className="place-list">
          {nearbyPlaces.length > 0 ? (
            nearbyPlaces.map((place, index) => (
              <li key={index} className="place-item">
                <span>{place.name}</span>
              </li>
            ))
          ) : (
            <li className="place-item">ไม่พบสถานที่ใกล้เคียง</li>
          )}
        </ul>
      </div>

      {/* ปุ่มเลือกจุดหมายปลายทาง */}
      <div className="pickup-button-container">
        <button
          className="pickup-button"
          onClick={handleDestinationSubmit}
        >
          เลือกจุดหมายปลายทาง
        </button>
      </div>
    </div>
  );
};

export default MapDestination;
