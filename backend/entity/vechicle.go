package entity

import "gorm.io/gorm"

type Vehicle struct {
	gorm.Model   
    
    LicensePlate  string    `json:"license_plate"`
    VehicleModel  string    `json:"model"`
    Capacity      int       `json:"capacity"`
    VehicleTypeID int       `json:"vehicle_type_id"`
    VehicleType   VehicleType `gorm:"foreignKey:VehicleTypeID" json:"vehicle_type"` // ความสัมพันธ์ belongsTo
    StatusID      int       `json:"status_id"`
    Status        Status    `gorm:"foreignKey:StatusID" json:"status"` // ความสัมพันธ์ belongsTo
	
    Drivers       []Driver  `gorm:"foreignKey:VehicleID" json:"drivers"` // ความสัมพันธ์ hasMany
}

