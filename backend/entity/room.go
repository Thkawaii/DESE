package entity

import (
	"gorm.io/gorm"
)

type Rooms struct {
	gorm.Model
	RoomName        string     `json:"room_name"`
	Capacity        uint8      `json:"capacity"`
	CurrentBookings uint8      `json:"current_bookings"` // จำนวนผู้จองในปัจจุบัน
	TrainerID       uint       `json:"trainer_id"`       // เชื่อมโยงกับ Trainers
	Trainer         *Trainers   `gorm:"foreignKey:TrainerID" json:"trainer"`
	Detail          string     `json:"detail"`           // รายละเอียดของห้อง
}