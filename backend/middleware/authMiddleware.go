package middleware

import (
	"os"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

func AuthRequired(c *fiber.Ctx) error {
	// 1. ดึง Token จาก Header (Authorization: Bearer <token>)
	header := c.Get("Authorization")

	if header == "" {
		return c.Status(401).JSON(fiber.Map{"error": "กรุณาเข้าสู่ระบบก่อน (ไม่มี Token)"})
	}

	// ตัดคำว่า "Bearer " ออก ให้เหลือแต่ตัวรหัส
	tokenString := strings.Replace(header, "Bearer ", "", 1)

	// 2. ตรวจสอบความถูกต้องของ Token (Verify)
	token, err := jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) {
		// เช็คว่าเป็นวิธีเข้ารหัสแบบ HMAC ไหม (เพื่อความชัวร์)
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fiber.ErrUnauthorized
		}
		// คืนค่า Secret Key เพื่อเอาไปไขรหัส
		return []byte(os.Getenv("JWT_SECRET")), nil
	})

	// ถ้า Token ผิด หรือหมดอายุ
	if err != nil || !token.Valid {
		return c.Status(401).JSON(fiber.Map{"error": "Token ไม่ถูกต้อง หรือหมดอายุแล้ว"})
	}

	// 3. (Optional) ดึงข้อมูลใน Token ออกมาใช้ต่อ (เช่น User ID)
	claims, ok := token.Claims.(jwt.MapClaims)
	if ok && token.Valid {
		// ฝาก User ID ไว้ใน Context เผื่อฟังก์ชันถัดไปอยากใช้
		// (เช่น เอาไปเช็คว่าเป็นเจ้าของหนังสือเล่มนี้ไหม)
		c.Locals("user_id", claims["user_id"])
	}

	// 4. ผ่านด่านได้! ไปทำงานต่อ (Next)
	return c.Next()
}
