package config

import (
    "golang.org/x/crypto/bcrypt"
    "os"
)

// HashPassword เป็นฟังก์ชันสำหรับการแปลงรหัสผ่านให้เป็นแฮช
func HashPassword(password string) (string, error) {
    bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14) // ระดับการแฮชเป็น 14
    return string(bytes), err
}

// CheckPasswordHash เป็นฟังก์ชันสำหรับตรวจสอบรหัสผ่านที่แฮชแล้วว่าตรงกันหรือไม่
func CheckPasswordHash(password, hash []byte) bool {
    err := bcrypt.CompareHashAndPassword(hash, password)
    return err == nil
}

// GetSecretKey retrieves the JWT secret key from environment variables or defaults
func GetSecretKey() string {
    secretKey := os.Getenv("JWT_SECRET_KEY") // ดึงค่าคีย์ลับจากตัวแปรสิ่งแวดล้อม
    if secretKey == "" {
        return "default_secret_key" // ใช้ค่าเริ่มต้นถ้าไม่มีการตั้งค่าคีย์ใน environment
    }
    return secretKey
}