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
	database, err := gorm.Open(sqlite.Open("cabana.db?cache=shared"), &gorm.Config{})
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
		&entity.Roles{}, // เพิ่ม Role เข้าไปในระบบ
		&entity.DiscountType{},
		&entity.Employee{},
		&entity.Gender{},
		&entity.Position{},
		&entity.Promotion{},
		&entity.StatusPromotion{},


	)

	// สร้าง Role สำหรับแต่ละกลุ่มผู้ใช้
	rolePassenger := &entity.Roles{Name: "Passenger"}
	roleDriver := &entity.Roles{Name: "Driver"}
	roleEmployee := &entity.Roles{Name: "Employee"}

	// เพิ่ม Role ลงในฐานข้อมูล (FirstOrCreate ป้องกันข้อมูลซ้ำ)
	db.FirstOrCreate(&rolePassenger, entity.Roles{Name: "Passenger"})
	db.FirstOrCreate(&roleDriver, entity.Roles{Name: "Driver"})
	db.FirstOrCreate(&roleEmployee, entity.Roles{Name: "Employee"})

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

	// สมมติว่า LocationID ที่ต้องการเชื่อมโยงคือ 1
var location entity.Location
db.First(&location, 1)  // ดึงข้อมูล Location ที่มี ID = 1 (คุณสามารถเปลี่ยนเป็น ID ที่ต้องการได้)

// ตรวจสอบค่า location.ID
fmt.Println("LocationID:", location.ID)  // ควรได้ 1

// สร้าง Driver ใหม่และเชื่อมโยงกับ Location
driver := &entity.Driver{
    Name:             "Somchai Prasertsak",
    DriverLicenseNum: "DL1234567890",
    PhoneNumber:      "0812345678",
    Password:         hashedPasswordDriver, // เก็บ Hash
    Profile:          "https://example.com/profiles/somchai.jpg",
    Income:           25000.50,
    BirthDate:        time.Date(1985, time.December, 1, 0, 0, 0, 0, time.UTC),
    RoleID:           roleDriver.ID,
    LocationID:       &location.ID, // กำหนด LocationID เพื่อเชื่อมโยงกับ Location ที่มีอยู่ในฐานข้อมูล
}

fmt.Println("LocationID before saving:", *driver.LocationID)  // ตรวจสอบค่าก่อนบันทึก

	// บันทึกข้อมูล Passenger และ Driver ในฐานข้อมูล
	db.Create(&passenger)
	db.Create(&driver)
	// เพิ่มข้อมูล StartLocation และ Destination ลงในฐานข้อมูล
	startLocations := []entity.StartLocation{
		{Latitude: 14.980960012481074, Longitude: 102.07647256499078, Province: "นครราชสีมา", Place: "เดอะมอลล์ โคราช"},
		{Latitude: 14.981817148237385, Longitude: 102.09006820372272, Province: "นครราชสีมา", Place: "เทอร์มินอล 21 โคราช"},
		{Latitude: 14.99620883082155, Longitude: 102.11690193142842, Province: "นครราชสีมา", Place: "เซ็นทรัล โคราช"},
		{Latitude: 14.973517989921909, Longitude: 102.07736950094439, Province: "นครราชสีมา", Place: "สำนักงาน สวนน้ำบุ่งตาหลั่วเฉลิมพระเกียรติ ร 9"},
		{Latitude: 15.220245426397717, Longitude: 102.49416213133622, Province: "นครราชสีมา", Place: "อุทยานประวัติศาสตร์พิมาย"},
		{Latitude: 14.37512463818282, Longitude: 101.9072681308245, Province: "นครราชสีมา", Place: "วังน้ำเขียว กู๊ดวิวรีสอร์ท"},
		{Latitude: 14.850508133822123, Longitude: 102.0746645027499, Province: "นครราชสีมา", Place: "สวนสัตว์นครราชสีมา (สวนสัตว์โคราช)"},
		{Latitude: 14.31117237465609, Longitude: 101.53042004471611, Province: "นครราชสีมา", Place: "อุทยานแห่งชาติเขาใหญ่"},
		{Latitude: 14.974895969729692, Longitude: 102.09813319917423, Province: "นครราชสีมา", Place: "อนุสาวรีย์ท้าวสุรนารี (ย่าโม)"},
		{Latitude: 14.980948433096135, Longitude: 102.11669346110233, Province: "นครราชสีมา", Place: "วัดศาลาลอย นครราชสีมา"},
		{Latitude: 14.882009958278621, Longitude: 102.02066401580193, Province: "นครราชสีมา", Place: "มหาวิทยาลัยเทคโนโลยีสุรนารี"},
		{Latitude: 14.848499736084525, Longitude: 101.56812216554933, Province: "นครราชสีมา", Place: "เขายายเที่ยง"},
		{Latitude: 14.952414948550437, Longitude: 102.03332810226271, Province: "นครราชสีมา", Place: "โรงเรียนราชสีมาวิทยาลัย"},
		{Latitude: 14.548179408257969, Longitude: 101.41997408928218, Province: "นครราชสีมา", Place: "น้ำผุดธรรมชาติบ้านท่าช้าง (น้ำผุดปากช่อง)"},
		{Latitude: 15.025331160361262, Longitude: 102.19368693156217, Province: "นครราชสีมา", Place: "ปราสาทหินพนมวัน"},
		{Latitude: 14.87250335523916, Longitude: 101.73253285887655, Province: "นครราชสีมา", Place: "มูลนิธิหลวงพ่อโตสรพงษ์"},
		{Latitude: 14.975725160132678, Longitude: 102.09614835994067, Province: "นครราชสีมา", Place: "ตลาดใหม่แม่กิมเฮง"},
		{Latitude: 14.864280528217657, Longitude: 102.03552163076583, Province: "นครราชสีมา", Place: "โรงพยาบาลมหาวิทยาลัยเทคโนโลยีสุรนารี (อาคาร รัตนเวชพัฒน์)"},
		{Latitude: 14.982001818684658, Longitude: 102.07259374446531, Province: "นครราชสีมา", Place: "โรงพยาบาลกรุงเทพราชสีมา"},
		{Latitude: 14.985065150952773, Longitude: 102.10347068884467, Province: "นครราชสีมา", Place: "โรงพยาบาลมหาราชนครราชสีมา"},
		{Latitude: 14.98940978364156, Longitude: 102.09464941531674, Province: "นครราชสีมา", Place: "สถานีขนส่งผู้โดยสารจังหวัดนครราชสีมา แห่งที่2"},
		{Latitude: 14.972355445519762, Longitude: 102.07852017438263, Province: "นครราชสีมา", Place: "สถานีรถไฟโคราช"},
		{Latitude: 14.963238645082374, Longitude: 102.09713140822721, Province: "นครราชสีมา", Place: "สนามม้าค่ายสุรนารี"},
		{Latitude: 14.957678743313668, Longitude: 102.04404047335788, Province: "นครราชสีมา", Place: "ตลาดเซฟวัน"},
		{Latitude: 14.982103474066514, Longitude: 102.09184923401598, Province: "นครราชสีมา", Place: "บิ๊กซี นครราชสีมา 1 (มิตรภาพ)"},
		{Latitude: 14.958084677338162, Longitude: 102.05821623103078, Province: "นครราชสีมา", Place: "โรงเหล้ามิตรภาพ โคราช​"},
		{Latitude: 14.875905641393333, Longitude: 102.01591891863089, Province: "นครราชสีมา", Place: "F11 อาคารสิรินธรวิศวพัฒน์ SIRINDHORN WITSAWAPHAT BUILDING"},
		{Latitude: 14.877685632501901, Longitude: 102.01406135812431, Province: "นครราชสีมา", Place: "สำนักวิชาศาสตร์และศิลป์ดิจิทัล (Digitech)"},
		{Latitude: 14.878712163559014, Longitude: 102.0156599915634, Province: "นครราชสีมา", Place: "ศูนย์บรรณสารและสื่อการศึกษา"},
	}
	

	destinations := []entity.Destination{
		{Latitude: 14.980960012481074, Longitude: 102.07647256499078, Province: "นครราชสีมา", Place: "เดอะมอลล์ โคราช"},
		{Latitude: 14.981817148237385, Longitude: 102.09006820372272, Province: "นครราชสีมา", Place: "เทอร์มินอล 21 โคราช"},
		{Latitude: 14.99620883082155, Longitude: 102.11690193142842, Province: "นครราชสีมา", Place: "เซ็นทรัล โคราช"},
		{Latitude: 14.973517989921909, Longitude: 102.07736950094439, Province: "นครราชสีมา", Place: "สำนักงาน สวนน้ำบุ่งตาหลั่วเฉลิมพระเกียรติ ร 9"},
		{Latitude: 15.220245426397717, Longitude: 102.49416213133622, Province: "นครราชสีมา", Place: "อุทยานประวัติศาสตร์พิมาย"},
		{Latitude: 14.37512463818282, Longitude: 101.9072681308245, Province: "นครราชสีมา", Place: "วังน้ำเขียว กู๊ดวิวรีสอร์ท"},
		{Latitude: 14.850508133822123, Longitude: 102.0746645027499, Province: "นครราชสีมา", Place: "สวนสัตว์นครราชสีมา (สวนสัตว์โคราช)"},
		{Latitude: 14.31117237465609, Longitude: 101.53042004471611, Province: "นครราชสีมา", Place: "อุทยานแห่งชาติเขาใหญ่"},
		{Latitude: 14.974895969729692, Longitude: 102.09813319917423, Province: "นครราชสีมา", Place: "อนุสาวรีย์ท้าวสุรนารี (ย่าโม)"},
		{Latitude: 14.980948433096135, Longitude: 102.11669346110233, Province: "นครราชสีมา", Place: "วัดศาลาลอย นครราชสีมา"},
		{Latitude: 14.882009958278621, Longitude: 102.02066401580193, Province: "นครราชสีมา", Place: "มหาวิทยาลัยเทคโนโลยีสุรนารี"},
		{Latitude: 14.848499736084525, Longitude: 101.56812216554933, Province: "นครราชสีมา", Place: "เขายายเที่ยง"},
		{Latitude: 14.952414948550437, Longitude: 102.03332810226271, Province: "นครราชสีมา", Place: "โรงเรียนราชสีมาวิทยาลัย"},
		{Latitude: 14.548179408257969, Longitude: 101.41997408928218, Province: "นครราชสีมา", Place: "น้ำผุดธรรมชาติบ้านท่าช้าง (น้ำผุดปากช่อง)"},
		{Latitude: 15.025331160361262, Longitude: 102.19368693156217, Province: "นครราชสีมา", Place: "ปราสาทหินพนมวัน"},
		{Latitude: 14.87250335523916, Longitude: 101.73253285887655, Province: "นครราชสีมา", Place: "มูลนิธิหลวงพ่อโตสรพงษ์"},
		{Latitude: 14.975725160132678, Longitude: 102.09614835994067, Province: "นครราชสีมา", Place: "ตลาดใหม่แม่กิมเฮง"},
		{Latitude: 14.864280528217657, Longitude: 102.03552163076583, Province: "นครราชสีมา", Place: "โรงพยาบาลมหาวิทยาลัยเทคโนโลยีสุรนารี (อาคาร รัตนเวชพัฒน์)"},
		{Latitude: 14.982001818684658, Longitude: 102.07259374446531, Province: "นครราชสีมา", Place: "โรงพยาบาลกรุงเทพราชสีมา"},
		{Latitude: 14.985065150952773, Longitude: 102.10347068884467, Province: "นครราชสีมา", Place: "โรงพยาบาลมหาราชนครราชสีมา"},
		{Latitude: 14.98940978364156, Longitude: 102.09464941531674, Province: "นครราชสีมา", Place: "สถานีขนส่งผู้โดยสารจังหวัดนครราชสีมา แห่งที่2"},
		{Latitude: 14.972355445519762, Longitude: 102.07852017438263, Province: "นครราชสีมา", Place: "สถานีรถไฟโคราช"},
		{Latitude: 14.963238645082374, Longitude: 102.09713140822721, Province: "นครราชสีมา", Place: "สนามม้าค่ายสุรนารี"},
		{Latitude: 14.957678743313668, Longitude: 102.04404047335788, Province: "นครราชสีมา", Place: "ตลาดเซฟวัน"},
		{Latitude: 14.982103474066514, Longitude: 102.09184923401598, Province: "นครราชสีมา", Place: "บิ๊กซี นครราชสีมา 1 (มิตรภาพ)"},
		{Latitude: 14.958084677338162, Longitude: 102.05821623103078, Province: "นครราชสีมา", Place: "โรงเหล้ามิตรภาพ โคราช​"},
		{Latitude: 14.875905641393333, Longitude: 102.01591891863089, Province: "นครราชสีมา", Place: "F11 อาคารสิรินธรวิศวพัฒน์ SIRINDHORN WITSAWAPHAT BUILDING"},
		{Latitude: 14.877685632501901, Longitude: 102.01406135812431, Province: "นครราชสีมา", Place: "สำนักวิชาศาสตร์และศิลป์ดิจิทัล (Digitech)"},
		{Latitude: 14.878712163559014, Longitude: 102.0156599915634, Province: "นครราชสีมา", Place: "ศูนย์บรรณสารและสื่อการศึกษา"},
		// Add the rest of the destinations here...
	}

	// Insert data into StartLocation and Destination tables
	for _, location := range startLocations {
		db.Create(&location)
	}
	for _, destination := range destinations {
		db.Create(&destination)
	}

	locations := []entity.Location{
		{Latitude: 14.989440874562565, Longitude: 102.09469233129263, Province: "นครราชสีมา", Place: "สถานีขนส่งผู้โดยสารจังหวัดนครราชสีมา แห่งที่2", Address: "ใกล้ถนนมิตรภาพ"},
		{Latitude: 14.97226216361242, Longitude: 102.07854163104108, Province: "นครราชสีมา", Place: "สถานีรถไฟโคราช", Address: "ถนนราชสีมา"},
		{Latitude: 14.980969671175174, Longitude: 102.07643761780784, Province: "นครราชสีมา", Place: "เดอะมอลล์ โคราช", Address: "ถนนมิตรภาพ"},
		{Latitude: 14.98183787602261, Longitude: 102.09010039126157, Province: "นครราชสีมา", Place: "เทอร์มินอล 21 โคราช", Address: "ถนนมิตรภาพ"},
		{Latitude: 14.996281374785447, Longitude: 102.11693411904838, Province: "นครราชสีมา", Place: "เซ็นทรัล โคราช", Address: "ถนนสุรนารายณ์"},
		{Latitude: 14.901746803513126, Longitude: 102.00956884715538, Province: "นครราชสีมา", Place: "Café Amazon สาขา มทส. ประตู 4", Address: "มหาวิทยาลัยเทคโนโลยีสุรนารี"},
		{Latitude: 14.978256144038262, Longitude: 102.09254730290546, Province: "นครราชสีมา", Place: "สถานีขนส่งนครราชสีมา", Address: "ใกล้ถนนสุรนารายณ์"},
		{Latitude: 14.974824485355242, Longitude: 102.0981385474978, Province: "นครราชสีมา", Place: "Café Class ใกล้ลานย่าโม", Address: "ถนนราชสีมา"},
		{Latitude: 14.986847325609906, Longitude: 102.09175265877519, Province: "นครราชสีมา", Place: "โรงเรียนอัสสัมชัญนครราชสีมา", Address: "ถนนสุรนารายณ์"},
		{Latitude: 13.745983305017283, Longitude: 100.5343802441482, Province: "กรุงเทพมหานคร", Place: "สยามพารากอน", Address: "ถนนพระราม 1"},
		{Latitude: 13.98919288476311, Longitude: 100.61774675399516, Province: "กรุงเทพมหานคร", Place: "ฟิวเจอร์พาร์ค รังสิต แอน สเปลล์", Address: "ถนนพหลโยธิน"},
		{Latitude: 13.813782036370695, Longitude: 100.54976354819318, Province: "กรุงเทพมหานคร", Place: "หน้าสถานีขนส่งหมอชิต 2", Address: "ถนนกำแพงเพชร 2"},
		{Latitude: 13.816038542388675, Longitude: 100.7251641441578, Province: "กรุงเทพมหานคร", Place: "ตลาดจตุจักร 2 (เมืองมีน)", Address: "ถนนพหลโยธิน"},
	}

	// สร้างข้อมูล Location และเชื่อมโยงกับ Driver
	for _, location := range locations {
    	db.Create(&location)  // เพิ่มข้อมูล Location ลงในฐานข้อมูล
	}
	db.Create(&driver)



	promotions := []entity.Promotion{
		{
			PromotionCode:        "DRIVE001",
			PromotionName:        "ส่งฟรี ไม่มีข้อแม้!",
			PromotionDescription: "รับบริการส่งฟรีสำหรับระยะทางไม่เกิน 10 กม.",
			Discount:             100.0, // คิดเป็นส่วนลดเต็ม 100%
			EndDate:              time.Now().Add(30 * 24 * time.Hour),
			UseLimit:             5,
			UseCount:             0,
			Distance:             10.0,
			Photo:                "promo1.jpg",
			DiscountTypeID:       2, // Percent discount
			StatusPromotionID:             1, // ACTIVE
		},
		{
			PromotionCode:        "DRIVE002",
			PromotionName:        "แค่ 5 กม. ก็ลดเลย!",
			PromotionDescription: "เดินทางในระยะทาง 5 กม. ขึ้นไป ลดทันที 50 บาท",
			Discount:             50.0,
			EndDate:              time.Now().Add(60 * 24 * time.Hour),
			UseLimit:             3,
			UseCount:             0,
			Distance:             5.0,
			Photo:                "promo2.jpg",
			DiscountTypeID:       1, // Amount discount
			StatusPromotionID:             1, // ACTIVE
		},
		{
			PromotionCode:        "DRIVE003",
			PromotionName:        "ระยะทางไกลก็ลดให้!",
			PromotionDescription: "รับส่วนลด 15% สำหรับการเดินทางในระยะทาง 20 กม. ขึ้นไป",
			Discount:             15.0,
			EndDate:              time.Now().Add(90 * 24 * time.Hour),
			UseLimit:             2,
			UseCount:             0,
			Distance:             20.0,
			Photo:                "promo3.jpg",
			DiscountTypeID:       2, // Percent discount
			StatusPromotionID:              1, // ACTIVE
		},
		{
			PromotionCode:        "DRIVE004",
			PromotionName:        "ยิ่งขยับ ยิ่งลด!",
			PromotionDescription: "รับส่วนลด 30 บาทเมื่อเดินทางในระยะทางเกิน 3 กม.",
			Discount:             30.0,
			EndDate:              time.Now().Add(120 * 24 * time.Hour),
			UseLimit:             1,
			UseCount:             0,
			Distance:             3.0,
			Photo:                "promo4.jpg",
			DiscountTypeID:       1, // Amount discount
			StatusPromotionID:             1, // ACTIVE
		},
		{
			PromotionCode:        "DRIVE005",
			PromotionName:        "8 กม. ส่งฟรี ไม่มีเงื่อนไข",
			PromotionDescription: "รับบริการส่งฟรีเมื่อระยะทางไม่เกิน 8 กม.",
			Discount:             100.0, // คิดเป็นส่วนลดเต็ม 100%
			EndDate:              time.Now().Add(45 * 24 * time.Hour),
			UseLimit:             1,
			UseCount:             0,
			Distance:             8.0,
			Photo:                "promo5.jpg",
			DiscountTypeID:       2, // Percent discount
			StatusPromotionID:             1, // ACTIVE
		},
		{
			PromotionCode:        "DRIVE006",
			PromotionName:        "15 กม. ลดให้เลย 20%",
			PromotionDescription: "รับส่วนลด 20% สำหรับการเดินทางที่ระยะทางขั้นต่ำ 15 กม.",
			Discount:             20.0,
			EndDate:              time.Now().Add(180 * 24 * time.Hour),
			UseLimit:             1,
			UseCount:             0,
			Distance:             15.0,
			Photo:                "promo6.jpg",
			DiscountTypeID:       2, // Percent discount
			StatusPromotionID:              2, // ACTIVE
		},
		{
			PromotionCode:        "DRIVE007",
			PromotionName:        "12 กม. ขึ้นไป ลด 100!",
			PromotionDescription: "รับส่วนลด 100 บาทสำหรับการเดินทางที่ระยะทางเกิน 12 กม.",
			Discount:             100.0,
			EndDate:              time.Now().Add(60 * 24 * time.Hour),
			UseLimit:             3,
			UseCount:             0,
			Distance:             12.0,
			Photo:                "promo7.jpg",
			DiscountTypeID:       1, // Amount discount
			StatusPromotionID:             2, // ACTIVE
		},
		{
			PromotionCode:        "DRIVE008",
			PromotionName:        "6 กม. สุดคุ้ม!",
			PromotionDescription: "เดินทางในระยะทางไม่เกิน 6 กม. รับส่วนลด 50%",
			Discount:             50.0,
			EndDate:              time.Now().Add(30 * 24 * time.Hour),
			UseLimit:             5,
			UseCount:             0,
			Distance:             6.0,
			Photo:                "promo8.jpg",
			DiscountTypeID:       2, // Percent discount
			StatusPromotionID:             2, // ACTIVE
		},
		{
			PromotionCode:        "DRIVE009",
			PromotionName:        "18 กม. ลดแรง 25%",
			PromotionDescription: "ลด 25% สำหรับระยะทางเกิน 18 กม.",
			Discount:             25.0,
			EndDate:              time.Now().Add(90 * 24 * time.Hour),
			UseLimit:             3,
			UseCount:             0,
			Distance:             18.0,
			Photo:                "promo9.jpg",
			DiscountTypeID:       2, // Percent discount
			StatusPromotionID:             2, // ACTIVE
		},
		{
			PromotionCode:        "DRIVE010",
			PromotionName:        "ระยะทางใกล้ ส่งฟรี!",
			PromotionDescription: "ระยะทางไม่เกิน 5 กม. รับบริการส่งฟรี",
			Discount:             100.0, // คิดเป็นส่วนลดเต็ม 100%
			EndDate:              time.Now().Add(60 * 24 * time.Hour),
			UseLimit:             1,
			UseCount:             0,
			Distance:             5.0,
			Photo:                "promo10.jpg",
			DiscountTypeID:       2, // Percent discount
			StatusPromotionID:              2, // ACTIVE
		},
	}
	// บันทึกข้อมูลโปรโมชั่นตัวอย่างลงในฐานข้อมูล
	for _, promo := range promotions {
		db.FirstOrCreate(&promo, &entity.Promotion{PromotionCode: promo.PromotionCode})
	}

	

	fmt.Println("Database setup and seeding completed")
}
