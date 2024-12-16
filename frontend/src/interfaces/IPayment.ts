
export interface Paymentx {
    ID?: number;                   // Optional unique identifier for the payment
    PaymentDate: string;           // Date of the payment as an ISO8601 string
    TotalAmount: number;           // Total amount paid
    PaymentMethod: string;         // Method of payment (e.g., Credit Card, Cash, etc.)
    BookingID?: number;             // Foreign key linking to the booking
    Booking?: number;             // Optional associated booking data
    PromotionID?: number;          // Optional foreign key linking to a promotion
    Promotion?: number; // Optional associated promotion details
}
