package entity

import "gorm.io/gorm"

type Passenger struct {
	gorm.Model  
    
    UserName   string       `json:"user_name"`
    FirstName   string    `json:"first_name"`
    LastName   string    `json:"last_name"`
    PhoneNumber string    `json:"phone_number"`
    Email       string    `json:"email"`
    Password    string    `json:"password"`

    GenderID    *uint       `json:"gender_id"`
    Gender      Gender    `gorm:"foreignKey:GenderID" json:"gender"` // ความสัมพันธ์ belongsTo

    Bookings    []Booking `gorm:"foreignKey:PassengerID" json:"bookings"` // ความสัมพันธ์ hasMany

	Messages       []Message `gorm:"foreignKey:PassengerID" json:"messages"` // ความสัมพันธ์ hasMany

    RoleID   uint   `gorm:"not null"`
    Role     Roles   `gorm:"foreignKey:RoleID"`
}
