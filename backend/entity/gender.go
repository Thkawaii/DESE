package entity

type Gender struct {
    GenderID   int         `gorm:"primaryKey" json:"gender_id"`
    GenderName string      `json:"gender_name"`
    Passengers []Passenger `gorm:"foreignKey:GenderID" json:"passengers"` // ความสัมพันธ์ hasMany
	
    Drivers    []Driver    `gorm:"foreignKey:GenderID" json:"drivers"` // ความสัมพันธ์ hasMany
}
