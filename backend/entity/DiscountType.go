package entity


import "gorm.io/gorm"


type DiscountType struct {

   gorm.Model

   DiscountType string  `json:"discount_type"` // ชื่อประเภทส่วนลด เช่น "amount" หรือ "percent"

}
