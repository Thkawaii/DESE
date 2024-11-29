package entity

import (
    "gorm.io/gorm"
)

type TrainBooking struct {
    gorm.Model
    RoomID    uint      `json:"room_id"`    // เชื่อมโยงกับ Rooms
    Room      Rooms     `gorm:"foreignKey:RoomID" json:"room"`
   
    Status    string    `json:"status"`     // สถานะการจอง (เช่น "Pending", "Confirmed", "Cancelled")

	DriverID    *uint    `json:"driver_id"`    // เชื่อมกับ Driver
	Driver      Driver `gorm:"foreignKey:DriverID" json:"driver"` // ความสัมพันธ์ belongsTo

}
