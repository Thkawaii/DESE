package entity

import "gorm.io/gorm"

type Position struct {

   gorm.Model

   Position string `json:"position"`

}