package entity

import "gorm.io/gorm"

type Booking struct {
    gorm.Model
    Beginning   string  `json:"beginning"`
    Terminus    string  `json:"terminus"`
    StartTime   string  `json:"start_time"`
    EndTime     string  `json:"end_time"`
    Distance    float64 `json:"distance"`
    TotalPrice  float64 `json:"total_price"`
    BookingTime string  `json:"booking_time"`
    BookingStatus string `json:"booking_status"`
    Vehicle     string  `json:"vehicle"`

    PassengerID *uint    `json:"passenger_id"`
    Passenger   Passenger `gorm:"foreignKey:PassengerID" json:"passenger"` // ความสัมพันธ์ belongsTo

    DriverID    *uint     `json:"driver_id"`
    Driver      Driver    `gorm:"foreignKey:DriverID" json:"driver"` // ความสัมพันธ์ belongsTo

    Messages    []Message `gorm:"foreignKey:BookingID" json:"messages"` // ความสัมพันธ์ hasMany

    StartLocationID *uint `json:"start_location_id"` // Foreign Key
    StartLocation   StartLocation `gorm:"foreignKey:StartLocationID" json:"start_location"` // ความสัมพันธ์ hasOne

    DestinationID *uint `json:"destination_id"` // Foreign Key
    Destination   Destination `gorm:"foreignKey:DestinationID" json:"destination"` // ความสัมพันธ์ hasOne
}
