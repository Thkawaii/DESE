package controller

import (
    "net/http"
    "project-se/entity"
    "project-se/config"
    "github.com/gin-gonic/gin"
    "fmt"
)

func CreateStartLocation(c *gin.Context) {
    // กำหนด Content-Type
    c.Header("Content-Type", "application/json")

    var startLocation entity.StartLocation
    if err := c.ShouldBindJSON(&startLocation); err != nil {
        // ส่ง error กลับไปหากข้อมูลไม่ถูกต้อง
        c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "Invalid request body", "error": err.Error()})
        return
    }

    // ตรวจสอบค่าที่จำเป็น (Latitude, Longitude, Province, Place)
    if startLocation.Latitude == 0 || startLocation.Longitude == 0 {
        c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "Latitude and Longitude are required"})
        return
    }

    if startLocation.Province == "" {
        c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "Province is required"})
        return
    }

    if startLocation.Place == "" {
        c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "Place is required"})
        return
    }

    if startLocation.Address == "" {
        c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "Address is required"})
        return
    }

    // เชื่อมต่อกับฐานข้อมูล
    db := config.DB()

    // บันทึกข้อมูลลงในฐานข้อมูล
    if err := db.Create(&startLocation).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{
            "status":  "error",
            "message": fmt.Sprintf("Failed to save start location: %v", err),
        })
        return
    }

    // ส่งข้อมูลที่ถูกบันทึกกลับไป
    c.JSON(http.StatusCreated, gin.H{
        "status": "success",
        "data": map[string]interface{}{
            "id":       startLocation.ID,       // ID ที่สร้างขึ้นในฐานข้อมูล
            "latitude": startLocation.Latitude,
            "longitude": startLocation.Longitude,
            "province": startLocation.Province,
            "place":    startLocation.Place,
            "address":  startLocation.Address,
        },
    })
}
