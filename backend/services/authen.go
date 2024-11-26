package services

import (
    "errors"
    "time"

    jwt "github.com/golang-jwt/jwt/v4"
)

// JwtWrapper wraps the signing key and the issuer
type JwtWrapper struct {
    SecretKey       string // คีย์ลับที่ใช้ในการเข้ารหัสและตรวจสอบ
    Issuer          string // ผู้ให้บริการที่ออกโทเค็น
    ExpirationHours int64  // ระยะเวลาหมดอายุของโทเค็น (ชั่วโมง)
}

// JwtClaim adds username as a claim to the token
type JwtClaim struct {
    Username string // ชื่อผู้ใช้
    jwt.StandardClaims
}

// GenerateToken generates a jwt token
func (j *JwtWrapper) GenerateToken(username string) (signedToken string, err error) {
    claims := &JwtClaim{
        Username: username, // ใช้ชื่อผู้ใช้แทนที่ Email
        StandardClaims: jwt.StandardClaims{
            ExpiresAt: time.Now().Local().Add(time.Hour * time.Duration(j.ExpirationHours)).Unix(),
            Issuer:    j.Issuer,
        },
    }

    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

    signedToken, err = token.SignedString([]byte(j.SecretKey))
    if err != nil {
        return "", err // ส่งค่ากลับเป็น error ถ้ามีปัญหาในการสร้างโทเค็น
    }

    return signedToken, nil
}

// ValidateToken validates the jwt token
func (j *JwtWrapper) ValidateToken(signedToken string) (claims *JwtClaim, err error) {
    token, err := jwt.ParseWithClaims(
        signedToken,
        &JwtClaim{},
        func(token *jwt.Token) (interface{}, error) {
            // ตรวจสอบว่าประเภทของการเข้ารหัสตรงกับที่คาดหวัง
            if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
                return nil, errors.New("unexpected signing method")
            }
            return []byte(j.SecretKey), nil // คืนค่าคีย์ลับสำหรับการตรวจสอบ
        },
    )

    if err != nil {
        return nil, err // ส่งค่ากลับเป็น error ถ้ามีปัญหาในการตรวจสอบโทเค็น
    }

    claims, ok := token.Claims.(*JwtClaim)
    if !ok {
        return nil, errors.New("Couldn't parse claims") // ข้อผิดพลาดในการแปลง claims
    }

    if claims.ExpiresAt < time.Now().Local().Unix() {
        return nil, errors.New("JWT is expired") // ตรวจสอบว่าโทเค็นหมดอายุหรือไม่
    }

    return claims, nil // คืนค่า claims ที่ถูกต้อง
}