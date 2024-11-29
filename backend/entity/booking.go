package entity

import "gorm.io/gorm"

type Booking struct {
	gorm.Model 
    Beginning   string  `json:"beginning"`
    Terminus string  `json:"terminus"`
    StartTime      string   `json:"start_time"`
    EndTime        string   `json:"end_time"`
    Distance       float64  `json:"distance"`
    TotalPrice     float64  `json:"total_price"`
    BookingTime    string   `json:"booking_time"`
    BookingStatus  string   `json:"booking_status"`

    PassengerID    *uint      `json:"passenger_id"`
    Passenger      Passenger `gorm:"foreignKey:PassengerID" json:"passenger"` // ความสัมพันธ์ belongsTo

    DriverID       *uint      `json:"driver_id"`
    Driver         Driver   `gorm:"foreignKey:DriverID" json:"driver"` // ความสัมพันธ์ belongsTo


    Messages       []Message `gorm:"foreignKey:BookingID" json:"messages"` // ความสัมพันธ์ hasMany

	StartLocation  StartLocation `gorm:"foreignKey:BookingID" json:"start_location"`
    Destination    Destination   `gorm:"foreignKey:BookingID" json:"destination"`
	
}


