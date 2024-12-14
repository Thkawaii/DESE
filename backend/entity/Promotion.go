package entity


import (
	
	"time"
	"gorm.io/gorm"

)

type Promotion struct {
    gorm.Model
    PromotionCode        string         `json:"promotion_code" gorm:"unique;not null"`
    PromotionName        string         `json:"promotion_name"`
    PromotionDescription string         `json:"promotion_description"`
    Discount             float64        `json:"discount"`
    EndDate              time.Time      `json:"end_date"`
    UseLimit             int            `json:"use_limit"`
    UseCount             int            `json:"use_count"`
    Distance             float64        `json:"distance"`
    Photo                string         `gorm:"type:longtext" json:"photo"`

    DiscountTypeID       uint           `json:"discount_type_id"`
    DiscountType         *DiscountType  `gorm:"foreignKey:DiscountTypeID" json:"discount_type"`

    StatusPromotionID    uint           `json:"statuspromotion_id"`
    StatusPromotion      *StatusPromotion `gorm:"foreignKey:StatusPromotionID" json:"statuspromotion"`
}
