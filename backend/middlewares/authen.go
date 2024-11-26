package middlewares

import (
    "net/http"
    "strings"
    "project-se/services"
    "project-se/config" // นำเข้า config เพื่อใช้คีย์ลับ
    "github.com/gin-gonic/gin"
    "fmt" // นำเข้า fmt สำหรับการพิมพ์ข้อความ
)

// Authorizes เป็นฟังก์ชันตรวจเช็คโทเค็น
func Authorizes() gin.HandlerFunc {
    return func(c *gin.Context) {
        // รับค่า Authorization header
        clientToken := c.Request.Header.Get("Authorization")

        // ตรวจสอบว่ามี Authorization header หรือไม่
        if clientToken == "" {
            fmt.Println("No Authorization header provided") // พิมพ์ข้อความเมื่อไม่มี header
            c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "No Authorization header provided"})
            return
        }

        // ตรวจสอบรูปแบบของโทเค็น
        if !strings.HasPrefix(clientToken, "Bearer ") {
            fmt.Println("Incorrect Format of Authorization Token") // พิมพ์ข้อความเมื่อรูปแบบไม่ถูกต้อง
            c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Incorrect Format of Authorization Token"})
            return
        }

        // ตัด "Bearer " ออกเพื่อให้เหลือแค่โทเค็น
        clientToken = strings.TrimSpace(strings.TrimPrefix(clientToken, "Bearer "))

        // สร้าง JwtWrapper สำหรับการตรวจสอบโทเค็น
        jwtWrapper := services.JwtWrapper{
            SecretKey: config.GetSecretKey(), // ใช้คีย์จาก config
            Issuer:    "AuthService",
        }

        // ตรวจสอบความถูกต้องของโทเค็น
        _, err := jwtWrapper.ValidateToken(clientToken)
        if err != nil {
            fmt.Printf("Token validation error: %v\n", err) // พิมพ์ข้อผิดพลาดที่เกิดขึ้น
            c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
            return
        }

        fmt.Println("Token validated successfully") // พิมพ์เมื่อโทเค็นถูกต้อง
        c.Next() // ถ้าโทเค็นถูกต้องให้ดำเนินการต่อไป
    }
}