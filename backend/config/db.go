package config

import (
	"fmt"
	"project-se/entity"
	"time"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var db *gorm.DB

// ฟังก์ชันคืนค่า Database Instance
func DB() *gorm.DB {
	return db
}

// ฟังก์ชันเชื่อมต่อฐานข้อมูล
func ConnectionDB() {
	database, err := gorm.Open(sqlite.Open("se.db?cache=shared"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}
	fmt.Println("Connected to the database")
	db = database
}

// ฟังก์ชันตั้งค่าโครงสร้างฐานข้อมูลและเพิ่มข้อมูลเริ่มต้น
func SetupDatabase() {
	// AutoMigrate สำหรับสร้างตาราง
	db.AutoMigrate(
		&entity.Passenger{},
		&entity.Driver{},
		&entity.Message{},
		&entity.Booking{},
		&entity.Location{},
		&entity.Gender{},
		&entity.Status{},
		&entity.Vehicle{},
		&entity.VehicleType{},
		&entity.StartLocation{},
		&entity.Destination{},
		&entity.Role{}, // เพิ่ม Role เข้าไปในระบบ
	)

	// สร้าง Role สำหรับแต่ละกลุ่มผู้ใช้
	rolePassenger := &entity.Role{Name: "Passenger"}
	roleDriver := &entity.Role{Name: "Driver"}
	roleEmployee := &entity.Role{Name: "Employee"}

	// เพิ่ม Role ลงในฐานข้อมูล (FirstOrCreate ป้องกันข้อมูลซ้ำ)
	db.FirstOrCreate(&rolePassenger, entity.Role{Name: "Passenger"})
	db.FirstOrCreate(&roleDriver, entity.Role{Name: "Driver"})
	db.FirstOrCreate(&roleEmployee, entity.Role{Name: "Employee"})

	// เข้ารหัสรหัสผ่าน
	hashedPasswordPassenger, err := HashPassword("12345")
	if err != nil {
		panic("Failed to hash password for Passenger")
	}

	hashedPasswordDriver, err := HashPassword("password123")
	if err != nil {
		panic("Failed to hash password for Driver")
	}

	// ข้อมูลเริ่มต้นสำหรับ Passenger
	passenger := &entity.Passenger{
		UserName:"SE1",
		FirstName: "Software",
		LastName:"Analysis" ,
		Email:       "se@gmail.com",
		PhoneNumber: "021313343",
		Password:    hashedPasswordPassenger, // เก็บ Hash แทน Plain Text
		RoleID:      rolePassenger.ID,
	}

	// ข้อมูลเริ่มต้นสำหรับ Driver
	driver := &entity.Driver{
		Name:             "Somchai Prasertsak",
		DriverLicenseNum: "DL1234567890",
		PhoneNumber:      "0812345678",
		Password:         hashedPasswordDriver, // เก็บ Hash
		Profile:          "https://example.com/profiles/somchai.jpg",
		Income:           25000.50,
		BirthDate:        time.Date(1985, time.December, 1, 0, 0, 0, 0, time.UTC),
		RoleID:           roleDriver.ID,
	}

	// บันทึกข้อมูล Passenger และ Driver ในฐานข้อมูล
	db.FirstOrCreate(&passenger, entity.Passenger{Email: "sa@gmail.com"})
	db.FirstOrCreate(&driver, entity.Driver{DriverLicenseNum: "DL1234567890"})

	fmt.Println("Database setup and seeding completed")
}
