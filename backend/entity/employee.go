package entity

import "gorm.io/gorm"
import "time"

type Employee struct {
	gorm.Model
	Firstname       string
    Lastname        string
    PhoneNumber     string
    Position        string
    Birthday        time.Time
    StartDate       time.Time
    Salary          float64
	Profile         []byte    `gorm:"type:blob"`
    Email           string
    Password        string
    
    GendersID       uint
    Genders         Genders `gorm:"foreignKey:GendersID"`

    RolesID         uint
    Roles           Roles   `gorm:"foreignKey:RolesID"`

}
