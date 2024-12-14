package entity

import "gorm.io/gorm"

type Location struct {
	gorm.Model   
    
    Latitude   float64 `json:"latitude"`
    Longitude  float64 `json:"longitude"`
    Address    string  `json:"address"`
	Province	string
	Place	string
    Timestamp  string  `json:"timestamp"`
    
    DriverID   int     `json:"driver_id"` // ฟิลด์ DriverID อยู่ใน Location
    Drivers    []Driver `gorm:"foreignKey:LocationID" json:"drivers"` // ความสัมพันธ์ hasMany

	
}