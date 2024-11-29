package entity


import (
	
	"time"

	"gorm.io/gorm"

)

type Promotion struct {
	gorm.Model // gorm.Model จะทำให้มี ID, CreatedAt, UpdatedAt, DeletedAt อัตโนมัติ

	PromotionCode        string    `json:"promotion_code" gorm:"unique;not null"`      // รหัสโปรโมชั่น
	PromotionName        string    `json:"promotion_name"`                              // ชื่อโปรโมชั่น
	PromotionDescription string    `json:"promotion_description"`                       // คำอธิบายโปรโมชั่น
	Discount             float64   `json:"discount"`                                   // ส่วนลดโปรโมชั่น
	EndDate              time.Time `json:"end_date"`                                   // วันที่หมดเขตโปรโมชั่น
	UseLimit             int       `json:"use_limit"`                                 	// จำนวนครั้งที่สามารถใช้โค้ดได้
	UseCount             int       `json:"use_count"`                                  	// จำนวนที่ใช้แล้ว
	Distance          	 float64   `json:"distance"`                                	// ระยะทางสูงสุด (กรอกเองในโปรโมชั่น)
    Photo                string    `gorm:"type:longtext" json:"photo"`  				// รูปโปรโมชั่น

	DiscountTypeID  	uint      		`json:"discount_type_id"`
	DiscountType    	*DiscountType  	`gorm:"foreignKey: discount_type_id" json:"discount_type"`

	StatusPromotionID  			uint      		`json:"statuspromotion_id"`
	StatusPromotion    			*StatusPromotion  		`gorm:"foreignKey: statuspromtion_id" json:"statuspromotion"`
}
