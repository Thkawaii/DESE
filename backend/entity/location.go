package entity

import "gorm.io/gorm"

type Location struct {
	gorm.Model   
    LocationID int     `gorm:"primaryKey" json:"location_id"`
    Latitude   float64 `json:"latitude"`
    Longitude  float64 `json:"longitude"`
    Address    string  `json:"address"`
	Province	string
	Place	string
    Timestamp  string  `json:"timestamp"`

    Drivers    []Driver `gorm:"foreignKey:LocationID" json:"drivers"` // ความสัมพันธ์ hasMany

	
}