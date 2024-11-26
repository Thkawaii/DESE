package entity

import "gorm.io/gorm"

type Message struct {
	gorm.Model  
    MessageID   int      `gorm:"primaryKey" json:"message_id"`
    Content     string   `json:"content"`
    MessageType string   `json:"message_type"`
    ReadStatus  bool     `json:"read_status"`
    SendTime    string   `json:"send_time"`

    PassengerID *uint      `json:"passenger_id"`
    Passenger   Passenger `gorm:"foreignKey:PassengerID" json:"passenger"` // ความสัมพันธ์ belongsTo

    BookingID   *uint      `json:"booking_id"`
    Booking     Booking  `gorm:"foreignKey:BookingID" json:"booking"` // ความสัมพันธ์ belongsTo
	
	DriverID    *uint    `json:"driver_id"`    // เชื่อมกับ Driver
	Driver      Driver `gorm:"foreignKey:DriverID" json:"driver"` // ความสัมพันธ์ belongsTo

	
}

