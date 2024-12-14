//import { BookingInterface } from "../../room/booking/interfaces/IBooking";

export interface ReviewInterface {
    ID?: number;
    Rating: number;
    Comment: string;
    BookingID: number;
    PassengerID: number;
    DriverID: number;
    //Booking?: BookingInterface;
}

