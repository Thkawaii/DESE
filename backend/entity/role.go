package entity

import "gorm.io/gorm"

type Roles struct {
	gorm.Model 
    Name string `gorm:"unique;not null"`
}
