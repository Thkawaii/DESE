import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom'; // ใช้ useNavigate แทน history
import './MapComponent.css'; // นำเข้าไฟล์ CSS
import {  sendDataStartlocationToBackend } from '../../services/https'; // import ฟังก์ชันจาก service


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

const MapComponent: React.FC = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null); // ตำแหน่งปัจจุบัน
  const [pickupLocation, setPickupLocation] = useState<{ lat: number; lng: number; name: string } | null>(null); // จุดรับ
  const [searchText, setSearchText] = useState<string>('');
  const [nearbyPlaces, setNearbyPlaces] = useState<any[]>([]); // รายการสถานที่ใกล้เคียง
  const [map, setMap] = useState<any>(null); // ใช้เก็บ map instance เพื่อใช้ในการเลื่อนแผนที่
  const navigate = useNavigate(); // ใช้ navigate สำหรับเปลี่ยนหน้า
  
  // ดึงตำแหน่งของผู้ใช้
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setLocation(userLocation);
          fetchNearbyPlaces(userLocation); // เรียกค้นหาสถานที่ใกล้เคียง
        },
        (error) => {
          console.error('Error getting location: ', error);
          const defaultLocation = {
            lat: 13.736717, // กำหนดตำแหน่งเริ่มต้น (กรุงเทพฯ)
            lng: 100.523186,
          };
          setLocation(defaultLocation);
          fetchNearbyPlaces(defaultLocation); // เรียกค้นหาสถานที่ใกล้เคียง
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      const defaultLocation = {
        lat: 13.736717, // กำหนดตำแหน่งเริ่มต้น (กรุงเทพฯ)
        lng: 100.523186,
      };
      setLocation(defaultLocation);
      fetchNearbyPlaces(defaultLocation); // เรียกค้นหาสถานที่ใกล้เคียง
    }
  }, []);

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

  const handleMapClick = (event: any) => {
  const lat = event.latLng.lat();
  const lng = event.latLng.lng();
  console.log('Clicked position:', lat, lng); // ตรวจสอบค่าที่ได้จากการคลิก

  const geocoder = new window.google.maps.Geocoder();
  geocoder.geocode({ location: { lat, lng } }, (results, status) => {
    if (status === window.google.maps.GeocoderStatus.OK && results.length > 0) {
      const placeName = results[0].formatted_address;
      setPickupLocation({ lat, lng, name: placeName });
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
        
        // เลื่อนแผนที่ไปยังตำแหน่งที่ค้นหา
        if (map) {
          map.panTo(location); // เลื่อนแผนที่ไปยังพิกัด
          map.setZoom(15); // ตั้งค่า zoom ระดับที่เหมาะสม
        }
  
        // อัปเดตข้อมูลจุดรับ
        setPickupLocation({ name: firstResult.name, lat: location.lat(), lng: location.lng() });
        console.log("Searched Place:", firstResult.name, "Latitude:", location.lat(), "Longitude:", location.lng());  // แสดงผลที่ค้นหา
    
      }
    });
  };

  const [startLocationId, setStartLocationId] = React.useState<number | null>(null);
  const handlePickUpSubmit = async () => {
    console.log("Pickup Location:", pickupLocation);
  
    if (pickupLocation) {
      try {
        const startLocationId = await sendDataStartlocationToBackend(pickupLocation);
        setStartLocationId(startLocationId); // เก็บ ID ใน state
        console.log("Start Location ID:", startLocationId);
  
        // ตรวจสอบค่าก่อนส่งไปหน้า destination
        console.log("Navigating to /mapdestination with:", {
          pickupLocation,
          startLocationId,
        });
  
        navigate('/mapdestination', { state: { pickupLocation, startLocationId } });
      } catch (error) {
        console.error('Error sending pickup location:', error);
        alert('ไม่สามารถบันทึกข้อมูลจุดเริ่มต้นได้');
      }
    } else {
      alert("กรุณาเลือกจุดเริ่มต้นก่อน");
    }
  };
  
  

  const handleMapCenterChanged = () => {
    if (map && pickupLocation) {
      const center = map.getCenter(); // รับตำแหน่งปัจจุบันของแผนที่
      setPickupLocation((prevLocation) => {
        return prevLocation ? { ...prevLocation, lat: center.lat(), lng: center.lng() } : null;
      });
    }
  };

  if (!location) return <div>กำลังโหลดแผนที่...</div>;

  return (
    <div className="mapcomponent"style={{ position: 'relative' }}>
      <LoadScript googleMapsApiKey="api map" libraries={['places']}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={location}
          zoom={15}
          onLoad={(mapInstance) => {
            setMap(mapInstance); // เก็บ map instance เพื่อใช้เลื่อนแผนที่
            mapInstance.addListener('center_changed', handleMapCenterChanged); // ติดตามการเปลี่ยนแปลงของแผนที่
          }}
          onClick={handleMapClick} // เมื่อคลิกที่แผนที่ ให้เลือกจุดรับ
        >
          {/* แสดง Marker ที่ตำแหน่งของผู้ใช้ */}
          <Marker position={location} />

          {/* แสดง Marker ที่ตำแหน่งจุดรับ ถ้ามีการค้นหาหรือเลือกสถานที่ */}
          {pickupLocation && <Marker position={{ lat: pickupLocation.lat, lng: pickupLocation.lng }} />}
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

      {/* ปุ่มเลือกจุดรับ */}
      <div className="pickup-button-container">
        <button
          className="pickup-button"
          onClick={handlePickUpSubmit}
        >
          เลือกจุดรับ
        </button>
      </div>
    </div>
  );
};

export default MapComponent;
