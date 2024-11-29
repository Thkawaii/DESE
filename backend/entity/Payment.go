package entity

import (
	//"SE/entity/booking"      // Importing room package for Booking struct
	//"SE/entity/promotion" // Importing promotion package for Promotion struct
	"time"
)

type Payment struct {
	PaymentID      uint               `gorm:"primaryKey;autoIncrement"`
	PaymentAmount  float64            `gorm:"type:decimal(10,2);not null"`
	PaymentMethod  string             `gorm:"type:varchar(50);not null"`
	PaymentDate    time.Time          `gorm:"type:date;not null"`

	BookingID      int                `gorm:"unique;not null"`        // Foreign key with unique constraint for 1-to-1
	//Booking        room.Booking       gorm:"foreignKey:BookingID"   // Association with Booking

	PromotionID    *int               `gorm:"unique"`                // Optional foreign key with unique constraint for 1-to-1
	//Promotion      promotion.Promotion gorm:"foreignKey:PromotionID" // Association with Promotion
}