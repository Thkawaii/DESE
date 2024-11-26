package entity

import "gorm.io/gorm"

type VehicleType struct {
	gorm.Model   
    VehicleTypeID int       `gorm:"primaryKey" json:"vehicle_type_id"`
    LicenseName   string    `json:"license_name"`
    Vehicles      []Vehicle `gorm:"foreignKey:VehicleTypeID" json:"vehicles"` // ความสัมพันธ์ hasMany
}

