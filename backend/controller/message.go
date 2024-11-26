package controller

import (
	"net/http"
	"project-se/entity"
	"project-se/config"
	"github.com/gin-gonic/gin"
	"fmt"
)

func CreateMessage(c *gin.Context) {
	var message entity.Message

	// ตรวจสอบข้อมูลที่ส่งมา
	if err := c.ShouldBindJSON(&message); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// บันทึกข้อความในฐานข้อมูล (เรียกใช้ config.DB())
	if err := config.DB().Create(&message).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": message})
}

func GetMessagesByBookingID(c *gin.Context) {
    bookingID := c.Param("bookingID") // รับ BookingID
    fmt.Println("Received BookingID:", bookingID) // Debug

    var messages []entity.Message

    if err := config.DB().Where("booking_id = ?", bookingID).Find(&messages).Error; err != nil {
        fmt.Println("Database Error:", err) // Debug
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    fmt.Println("Fetched Messages:", messages) // Debug
    c.JSON(http.StatusOK, gin.H{"data": messages})
}
