package entity

import "gorm.io/gorm"

type VehicleType struct {
	gorm.Model   
    
    LicenseName   string    `json:"license_name"`
    Vehicles      []Vehicle `gorm:"foreignKey:VehicleTypeID" json:"vehicles"` // ความสัมพันธ์ hasMany
}

