package entity

type Review struct {
	ReviewID     uint           `gorm:"primaryKey;autoIncrement"`
	Rating       int            `gorm:"not null"`
	Comment      string         `gorm:"type:text"` // Can be set to text for longer comments

	BookingID    int            `gorm:"not null"`    // Foreign key
	//Booking      Booking        gorm:"foreignKey:BookingID"

	PassengerID  int            `gorm:"not null"`    // Foreign key
	//Passenger    Passenger      gorm:"foreignKey:PassengerID"

	DriverID     int            `gorm:"not null"`    // Foreign key
	//Driver       Driver         gorm:"foreignKey:DriverID"
}