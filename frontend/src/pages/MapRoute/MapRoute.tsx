import React from 'react';
import { useLocation } from 'react-router-dom';
import { GoogleMap, LoadScript, DirectionsRenderer, Marker } from '@react-google-maps/api';
import { FaMotorcycle, FaCar, FaTruckPickup } from 'react-icons/fa';
import './MapRoute.css';
import { sendBookingToBackend } from '../../services/https';
import { useNavigate } from 'react-router-dom';

const vehicles = [
  { id: 1, name: 'cabanabike', baseFare: 20, perKm: 5, capacity: 2, type: 'motorcycle', icon: <FaMotorcycle size={50} /> },
  { id: 2, name: 'cabanacar', baseFare: 40, perKm: 8, capacity: 4, type: 'car', icon: <FaCar size={50} /> },
  { id: 3, name: 'cabana luxe', baseFare: 60, perKm: 10, capacity: 6, type: 'special', icon: <FaTruckPickup size={50} /> },
];

const MapRoute: React.FC = () => {
  const location = useLocation();
  const { pickupLocation, startLocationId, destinationLocation, destinationId } = location.state || {};
  const navigate = useNavigate(); 
  const [directions, setDirections] = React.useState<any>(null);
  const [distance, setDistance] = React.useState<number | null>(null); // ระยะทางเป็นตัวเลข
  const [googleMapsReady, setGoogleMapsReady] = React.useState(false);
  const [selectedVehicle, setSelectedVehicle] = React.useState<number | null>(null);
  const [fare, setFare] = React.useState<number | null>(null); // ค่าโดยสาร
  

  const handleApiLoaded = () => {
    setGoogleMapsReady(true);
  };

  React.useEffect(() => {
    if (pickupLocation && destinationLocation && googleMapsReady) {
      const directionsService = new window.google.maps.DirectionsService();

      const request = {
        origin: { lat: pickupLocation.lat, lng: pickupLocation.lng },
        destination: { lat: destinationLocation.lat, lng: destinationLocation.lng },
        travelMode: window.google.maps.TravelMode.DRIVING,
      };

      directionsService.route(request, (result: any, status: any) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);

          const distanceInMeters = result.routes[0].legs[0].distance.value;
          const distanceInKm = distanceInMeters / 1000; // แปลงเป็นกิโลเมตร
          setDistance(distanceInKm);
        } else {
          console.error('Error fetching directions', status);
        }
      });
    }
  }, [pickupLocation, destinationLocation, googleMapsReady]);

  const handleSelectVehicle = (id: number) => {
    setSelectedVehicle(id);
    const selectedVehicleData = vehicles.find((v) => v.id === id);

    if (distance && selectedVehicleData) {
      const calculatedFare =
        selectedVehicleData.baseFare + selectedVehicleData.perKm * distance;
      setFare(calculatedFare);
    }
  };


  const handleBooking = async () => {
    // ตรวจสอบว่าเลือกยานพาหนะและระยะทางมีค่าแล้วหรือยัง
    if (!selectedVehicle || distance === null) {
      alert("กรุณาเลือกยานพาหนะและตรวจสอบข้อมูลให้ครบถ้วน");
      return;
    }
  
    if (!pickupLocation || !destinationLocation || !startLocationId || !destinationId) {
      alert("ข้อมูลสถานที่เริ่มต้นหรือจุดหมายปลายทางไม่ครบถ้วน");
      return;
    }
  
    const selectedVehicleData = vehicles.find((v) => v.id === selectedVehicle);
  
    // สร้างข้อมูลการจอง
    const bookingData = {
      beginning: pickupLocation.name || '', // ชื่อจุดเริ่มต้น
      terminus: destinationLocation.name || '', // ชื่อจุดหมายปลายทาง
      start_time: new Date().toISOString(), // เวลาที่เริ่มต้น
      end_time: '', // เวลาที่สิ้นสุด (ปล่อยให้ backend คำนวณได้)
      distance: parseFloat(distance.toFixed(2)), // ระยะทางในรูปแบบตัวเลข
      total_price: parseFloat(fare?.toFixed(2) || '0'), // ค่าโดยสาร
      booking_time: new Date().toISOString(), // เวลาการจอง
      booking_status: "Pending", // สถานะเริ่มต้น
      vehicle: selectedVehicleData?.name || '', // ชื่อยานพาหนะ
      start_location_id: startLocationId, // ID ของตำแหน่งเริ่มต้น
      destination_id: destinationId, // ID ของจุดหมายปลายทาง
      passenger_id: 1, // ตัวอย่าง Passenger ID (ต้องดึงจาก context หรือ state ในการทำงานจริง)
    };
  
    try {
      // เรียกใช้ฟังก์ชันส่งข้อมูลไป backend
      const result = await sendBookingToBackend(bookingData);
  
      if (result.success) {
        alert("การจองสำเร็จ!");
        console.log("Booking created:", result.data); // แสดงข้อมูลการจองที่สร้างใน console
  
        // นำทางไปยังหน้าการจองเสร็จสมบูรณ์
        navigate('/paid', { state: { total_price: bookingData.total_price } });
      } else {
        alert(`เกิดข้อผิดพลาด: ${result.message}`);
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("ไม่สามารถบันทึกข้อมูลการจองได้");
    }
  };
  
  return (
    <div className="MapRoute">
      <LoadScript
        googleMapsApiKey="api map"
        onLoad={handleApiLoaded}
      >
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '400px' }}
          zoom={12}
          center={pickupLocation || { lat: 13.736717, lng: 100.523186 }}
        >
          {directions && <DirectionsRenderer directions={directions} />}
          {pickupLocation && (
            <Marker
              position={{ lat: pickupLocation.lat, lng: pickupLocation.lng }}
              label="Pickup"
            />
          )}
          {destinationLocation && (
            <Marker
              position={{ lat: destinationLocation.lat, lng: destinationLocation.lng }}
              label="Destination"
            />
          )}
        </GoogleMap>
      </LoadScript>

    
      <div className="vehicle-options">
  {vehicles.map((vehicle, index) => {
    const fareForVehicle =
      distance !== null
        ? vehicle.baseFare + vehicle.perKm * distance
        : null;

      return (
        <div
          key={vehicle.id}
          className={`vehicle-item ${index % 2 === 0 ? 'even' : 'odd'} ${
            selectedVehicle === vehicle.id ? 'selected' : ''
          }`}
          onClick={() => handleSelectVehicle(vehicle.id)}
        >
          <div className="vehicle-icon">{vehicle.icon}</div>
          <div className="vehicle-info">
            <h3>{vehicle.name}</h3>
            <p>x{vehicle.capacity}</p>

            {distance !== null && <p>ระยะทาง: {distance.toFixed(2)} Km</p>}
            {fareForVehicle !== null && <p>ค่าโดยสาร: {fareForVehicle.toFixed(2)} บาท</p>}
          </div>
        </div>
      );
    })}
  </div>

  {/* เพิ่มปุ่มจอง Cabana */}
  <div className="booking-button-container">
    <button
      className="booking-button"
      onClick={() => handleBooking()}
      disabled={!selectedVehicle || distance === null} // ปิดใช้งานปุ่มหากยังไม่ได้เลือกยานพาหนะหรือไม่มีระยะทาง
    >
      Booking Cabana
    </button>
  </div>
</div>

    
  
  );
};

export default MapRoute;
