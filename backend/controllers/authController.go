package controllers

import (
	"my-shop/database" // ⚠️ เช็คชื่อ module ให้ตรงกับ go.mod
	"my-shop/models"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

func Register(c *fiber.Ctx) error {
	// 1. สร้าง struct มารอรับข้อมูลจากหน้าบ้าน
	var data map[string]string
	if err := c.BodyParser(&data); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "ข้อมูลไม่ถูกต้อง"})
	}

	// 2. เข้ารหัส Password (Hash) 🔒
	// Cost 14 คือความยากในการแกะ (ยิ่งเยอะยิ่งปลอดภัย แต่ช้า)
	password, _ := bcrypt.GenerateFromPassword([]byte(data["password"]), 14)

	// 3. สร้าง User object
	user := models.User{
		Email:    data["email"],
		Password: string(password), // เก็บแบบ Hash แล้ว
	}

	// 4. บันทึกลง Database
	if err := database.DB.Create(&user).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "อีเมลนี้ถูกใช้ไปแล้ว หรือระบบมีปัญหา"})
	}

	// 5. ส่งกลับแค่ ID และ Email (อย่าส่ง Password กลับไปนะ!)
	return c.JSON(fiber.Map{
		"message": "สมัครสมาชิกสำเร็จ",
		"user_id": user.ID,
		"email":   user.Email,
	})

}

func Login(c *fiber.Ctx) error {
	// 1. รับค่าจากหน้าบ้าน
	var data map[string]string
	if err := c.BodyParser(&data); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "ส่งข้อมูลมาไม่ครบ"})
	}

	// 2. ค้นหา User จาก Email
	var user models.User
	// .Where("email = ?", ...) คือการหาว่ามีอีเมลนี้ไหม
	database.DB.Where("email = ?", data["email"]).First(&user)

	// ถ้า ID เป็น 0 แปลว่าหาไม่เจอ
	if user.ID == 0 {
		return c.Status(404).JSON(fiber.Map{"error": "ไม่พบผู้ใช้นี้"})
	}

	// 3. เช็ครหัสผ่าน (เอาแบบไม่ Hash มาเทียบกับแบบ Hash ใน DB)
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(data["password"])); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "รหัสผ่านผิด"})
	}

	// 4. สร้าง JWT Token (บัตรผ่าน) 🎫
	// กำหนดว่าบัตรนี้มีข้อมูลอะไรบ้าง (Claims)
	claims := jwt.MapClaims{
		"user_id": user.ID,                               // แปะ ID ไว้ในบัตร
		"exp":     time.Now().Add(time.Hour * 24).Unix(), // บัตรหมดอายุใน 24 ชม.
	}

	// สร้าง Token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// เซ็นชื่อกำกับด้วยรหัสลับจาก .env
	t, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "สร้าง Token ไม่สำเร็จ"})
	}

	// 5. ส่ง Token กลับไปให้ User
	return c.JSON(fiber.Map{
		"message": "ล็อกอินสำเร็จ",
		"token":   t,
	})
}
