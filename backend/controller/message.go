package controller

import (
	"net/http"
	"project-se/entity"
	"project-se/config"
	"github.com/gin-gonic/gin"
	
)

/*func CreateMessage(c *gin.Context) {
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
}*/



// Message โครงสร้างสำหรับข้อความแชท
type Message struct {
	Room    string `json:"room"`
	Sender  string `json:"sender"`
	Content string `json:"content"`
}

// ตัวอย่างข้อมูลข้อความ (จำลองฐานข้อมูล)
var messages = []Message{}

// CreateMessage สร้างข้อความใหม่
func CreateMessage(c *gin.Context) {
	var newMessage Message
	// อ่าน JSON จาก client
	if err := c.ShouldBindJSON(&newMessage); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// เพิ่มข้อความลงใน slice
	messages = append(messages, newMessage)
	c.JSON(http.StatusCreated, gin.H{"message": "Message created successfully", "data": newMessage})
}


// GetAllMessages ดึงข้อความทั้งหมด
func GetAllMessages(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"messages": messages})
}

func GetMessagesByBookingID(c *gin.Context) {
	bookingID := c.Param("bookingID")

	// กรองข้อความจากฐานข้อมูล
	var filteredMessages []entity.Message // ใช้ entity.Message จาก package entity
	if err := config.DB().Where("room = ?", bookingID).Find(&filteredMessages).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// ส่งข้อความที่พบกลับไป
	c.JSON(http.StatusOK, gin.H{"messages": filteredMessages})
}

