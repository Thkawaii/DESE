package controller

import (
    "net/http"
    "project-se/entity"
    "project-se/config"
    "github.com/gin-gonic/gin"
    "fmt"
)

func CreateDestination(c *gin.Context) {
    fmt.Println("Request received for /destination") // เพิ่ม log สำหรับ Debugging
    c.Header("Content-Type", "application/json")

    var destination entity.Destination
    if err := c.ShouldBindJSON(&destination); err != nil {
        // ส่งข้อผิดพลาดหาก JSON ไม่ถูกต้อง
        c.JSON(http.StatusBadRequest, gin.H{
            "status":  "error",
            "message": "Invalid request body",
            "error":   err.Error(),
        })
        return
    }

    // ตรวจสอบค่าที่จำเป็น
    if destination.Latitude == 0 || destination.Longitude == 0 {
        c.JSON(http.StatusBadRequest, gin.H{
            "status":  "error",
            "message": "Latitude and Longitude are required",
        })
        return
    }

    if destination.Province == "" {
        c.JSON(http.StatusBadRequest, gin.H{
            "status":  "error",
            "message": "Province is required",
        })
        return
    }

    if destination.Place == "" {
        c.JSON(http.StatusBadRequest, gin.H{
            "status":  "error",
            "message": "Place is required",
        })
        return
    }

    if destination.Address == "" {
        c.JSON(http.StatusBadRequest, gin.H{
            "status":  "error",
            "message": "Address is required",
        })
        return
    }

    db := config.DB()

    // บันทึกข้อมูลลงในฐานข้อมูล
    if err := db.Create(&destination).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{
            "status":  "error",
            "message": fmt.Sprintf("Failed to save destination: %v", err),
        })
        return
    }

    // ส่งข้อมูลที่ถูกบันทึกกลับไป
    c.JSON(http.StatusCreated, gin.H{
        "status": "success",
        "data": map[string]interface{}{
            "id":       destination.ID,        // ส่ง ID กลับไปให้ frontend
            "latitude": destination.Latitude,
            "longitude": destination.Longitude,
            "province": destination.Province,
            "place":    destination.Place,
            "address":  destination.Address,
        },
    })
}
