package entity

import "gorm.io/gorm"
type StartLocation struct {
    gorm.Model
    Latitude  float64 `json:"latitude"`
    Longitude float64 `json:"longitude"`
    Address   string  `json:"address"` // ที่อยู่เพิ่มเติม (ถ้ามี)
   
	BookingID uint    `json:"booking_id"` // Foreign Key เชื่อมกับ Booking
	
}