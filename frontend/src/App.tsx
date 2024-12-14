import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/home"; // นำเข้าหน้า Home
import Chat from "./pages/chat/chat"; // นำเข้าหน้า Chat
import Booking from "./pages/booking/booking"; // นำเข้าหน้า Booking
import Pickup from "./pages/booking/pickup";
import CompletedBooking from "./pages/booking/completedBooking";
import AdvanceBooking from "./pages/booking/advancebooking";  
import Destination from "./pages/booking/destination"; 
import MapComponent from "./pages/startbooking/MapComponent";
import MapDestination from "./pages/MapDestination/MapDestination";
import MapRoute from "./pages/MapRoute/MapRoute";
import CabanaBooking from "./pages/marker/cabanabooking";
import RideHistory from "./pages/RideHistory/RideHistory";
import PassengerChat from "./pages/chat/PassengerChat";
import DriverChat from "./pages/chat/DriverChat";
import PromotionCreate from "./pages/promotion/create";
import PromotionEdit from "./pages/promotion/edit";
import Promotion from "./pages/promotion";
import View from "./pages/promotion/promotionview/promotion";
import HomePayment from "./pages/payment/paid/Home";
import Review from "./pages/review/review";
import Payment from "./pages/payment/payment";
import History from "./pages/review/review_history/history";
import Edit from "./pages/review/edit/edit";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>

      {/* ของเปิ้ล Booking and Chat */}
        <Route path="/" element={<Home />} /> {/* เส้นทางสำหรับหน้า Home */}
        <Route path="/chat" element={<Chat />} /> {/* เส้นทางสำหรับหน้า Chat */}
        <Route path="/booking" element={<Booking />} /> {/* เส้นทางสำหรับหน้า Booking */}
        <Route path="/pickup" element={<Pickup />} /> {/* เส้นทางหน้า Pickup */}
        <Route path="/completed-booking" element={<CompletedBooking />} /> {/* เส้นทางสำหรับ CompletedBooking */}
        <Route path="/advance-booking" element={<AdvanceBooking />} /> {/* เส้นทางสำหรับ CompletedBooking */}
        <Route path="/destination" element={<Destination />} /> {/* เส้นทางสำหรับ CompletedBooking */}
        <Route path="/map" element={<MapComponent />} /> {/* เส้นทางสำหรับ CompletedBooking */}
        <Route path="/mapdestination" element={<MapDestination />} /> {/* เส้นทางสำหรับ CompletedBooking */}
        <Route path="/maproute" element={<MapRoute />} /> {/* เส้นทางสำหรับ CompletedBooking */}
        <Route path="/RideHistory" element={<RideHistory />} /> {/* เส้นทางสำหรับ CompletedBooking */}
        <Route path="/PassengerChat" element={<PassengerChat />} /> {/* เส้นทางสำหรับ CompletedBooking */}
        <Route path="/DriverChat" element={<DriverChat />} /> {/* เส้นทางสำหรับ CompletedBooking */}


       {/*ต้อง* promotion */}
        <Route path="/Promotion" element={< View />} /> 



        {/*ฟร้อง Payment and Review */}
        <Route path="/paid" element={< HomePayment />} /> 
        <Route path="/review" element={<Review/>} /> 
        <Route path="/payment" element={<Payment/>} /> 
        <Route path="/review/history" element={<History/>} /> 
        <Route path="/edit" element={<Edit/>} /> 








        
      </Routes>
    </Router>
  );
};

export default App;
