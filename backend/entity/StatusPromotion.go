package entity


import "gorm.io/gorm"


type StatusPromotion struct {

   gorm.Model

   Status string  `json:"status"` // ชื่อประเภทส่วนลด เช่น "amount" หรือ "percent"

}