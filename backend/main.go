package main

import (
	"net/http"
	"project-se/config"
	"project-se/controller"
	"project-se/middlewares"

	"github.com/gin-gonic/gin"
)

func main() {
	const PORT = "8080" // ระบุพอร์ตที่ต้องการรัน

	// เชื่อมต่อฐานข้อมูล
	config.ConnectionDB()
	// ตั้งค่าฐานข้อมูล (เช่น Migration และ Seed ข้อมูล)
	config.SetupDatabase()

	// สร้าง Gin Router
	r := gin.Default()

	// เปิดใช้ CORS Middleware
	r.Use(CORSMiddleware())

	// Route ที่ไม่ต้องการ Authentication
	r.GET("/", func(c *gin.Context) {
		c.String(http.StatusOK, "API RUNNING... PORT: %s", PORT)
	})

	// Route สำหรับ Authentication
	/*auth := r.Group("/auth")
	{
		auth.POST("/register", controller.Register) // สำหรับการลงทะเบียน
		auth.POST("/login", controller.Login)       // สำหรับการเข้าสู่ระบบ
	}*/

	// Protected Routes (ต้องตรวจสอบ JWT)
	protected := r.Group("/api", middlewares.Authorizes())
	{
		// ตัวอย่าง Endpoints ที่ต้องการ Authentication
		protected.POST("/message", controller.CreateMessage)
		protected.GET("/messages/booking/:bookingID", controller.GetMessagesByBookingID)
	}

	// เริ่มต้น Run Server
	r.Run("localhost:" + PORT)
}

// CORSMiddleware จัดการ Cross-Origin Resource Sharing (CORS)
func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE, PATCH")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
