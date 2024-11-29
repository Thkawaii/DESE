
package entity

import (
	"time"
	"gorm.io/gorm"
)

type Driver struct {
	gorm.Model
	
	Name             string    `json:"name"`
	DriverLicenseNum string    `json:"driver_license_number"`
	PhoneNumber      string    `json:"phone_number"`
	Password         string    `json:"password"`
	Profile          string    `json:"profile"`
	Income           float64   `json:"income"`
	BirthDate        time.Time `json:"birth_date"` // วันเกิด

	GenderID         *uint       `json:"gender_id"`
	Gender           Gender    `gorm:"foreignKey:GenderID" json:"gender"` 

	LocationID       *uint       `json:"location_id"`
	Location         Location  `gorm:"foreignKey:LocationID" json:"location"` 
	
	VehicleID        *uint       `json:"vehicle_id"`
	Vehicle          Vehicle   `gorm:"foreignKey:VehicleID" json:"vehicle"` 

	StatusID         *uint       `json:"status_id"`
	Status           Status    `gorm:"foreignKey:StatusID" json:"status"` 

	Bookings         []Booking `gorm:"foreignKey:DriverID" json:"bookings"` 

	Messages         []Message `gorm:"foreignKey:DriverID" json:"messages"` 

	RoleID   uint   `gorm:"not null"`
    Role     Roles  `gorm:"foreignKey:RoleID"`
}



