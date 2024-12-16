import { ReactNode } from "react";

export interface Booking {
    Vehicle: ReactNode;
    Terminus: ReactNode;
    Beginning: ReactNode;
    ID: ReactNode;
    BookingID?: number;
    StartLocation?: string;
    Destination?: string;
    StartTime?: string;
    EndTime?: string;
    Distance?: number;
    TotalPrice?: number;
    BookingTime?: string;
    BookingStatus?: string;
    PassengerID?: number;
    DriverID?: number;
  }
  