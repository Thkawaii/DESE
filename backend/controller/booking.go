package controller

import (
	"net/http"
	"project-se/config"
	"project-se/entity"
	"github.com/gin-gonic/gin"
)

func CreateBooking(c *gin.Context) {
    var booking entity.Booking

    // ตรวจสอบ JSON ที่ส่งมา
    if err := c.ShouldBindJSON(&booking); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
        return
    }

    // เชื่อมต่อฐานข้อมูล
    db := config.DB()

    // บันทึกข้อมูลลงในฐานข้อมูล
    if err := db.Create(&booking).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create booking"})
        return
    }

    // ส่งข้อมูลที่สร้างกลับไปยัง client
    c.JSON(http.StatusCreated, gin.H{
        "message": "Booking created successfully",
        "data":    booking,
    })
}


// ดึงข้อมูล Booking ทั้งหมด
func GetAllBookings(c *gin.Context) {
	var bookings []entity.Booking
	db := config.DB()

	if err := db.Preload("StartLocation").Preload("Destination").Find(&bookings).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch bookings"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    bookings,
	})
}

// ดึงข้อมูล Booking ตาม ID
func GetBookingByID(c *gin.Context) {
	var booking entity.Booking
	db := config.DB()

	id := c.Param("id")
	if err := db.Preload("StartLocation").Preload("Destination").First(&booking, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Booking not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    booking,
	})
}