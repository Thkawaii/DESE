import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/home"; // นำเข้าหน้า Home
import Chat from "./pages/chat/chat"; // นำเข้าหน้า Chat
import Booking from "./pages/booking/booking"; // นำเข้าหน้า Booking
import Pickup from "./pages/booking/pickup";
import CompletedBooking from "./pages/booking/completedBooking";
import AdvanceBooking from "./pages/booking/advancebooking";  
import Destination from "./pages/booking/destination"; 

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> {/* เส้นทางสำหรับหน้า Home */}
        <Route path="/chat" element={<Chat />} /> {/* เส้นทางสำหรับหน้า Chat */}
        <Route path="/booking" element={<Booking />} /> {/* เส้นทางสำหรับหน้า Booking */}
        <Route path="/pickup" element={<Pickup />} /> {/* เส้นทางหน้า Pickup */}
        <Route path="/completed-booking" element={<CompletedBooking />} /> {/* เส้นทางสำหรับ CompletedBooking */}
        <Route path="/advance-booking" element={<AdvanceBooking />} /> {/* เส้นทางสำหรับ CompletedBooking */}
        <Route path="/destination" element={<Destination />} /> {/* เส้นทางสำหรับ CompletedBooking */}
      </Routes>
    </Router>
  );
};

export default App;
