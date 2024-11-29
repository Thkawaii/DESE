package entity

import (
	
	"gorm.io/gorm"
)

type Gender struct {
    gorm.Model  
    GenderName string      `json:"gender_name"`
    Passengers []Passenger `gorm:"foreignKey:GenderID" json:"passengers"` // ความสัมพันธ์ hasMany
	
    Drivers    []Driver    `gorm:"foreignKey:GenderID" json:"drivers"` // ความสัมพันธ์ hasMany
}
