package controllers

import (
	"my-shop/database"
	"my-shop/models"

	"github.com/gofiber/fiber/v2"
)

// 1. GetBooks: ดูหนังสือทั้งหมด 📚
func GetBooks(c *fiber.Ctx) error {
	var books []models.Book

	// สั่ง DB ให้หา (Find) ทุกอย่างมาใส่ในตัวแปร books
	database.DB.Find(&books)

	return c.JSON(books)
}

// 2. GetBook: ดูเล่มเดียว (ตาม ID) 🔍
func GetBook(c *fiber.Ctx) error {
	id := c.Params("id") // รับเลข ID จาก URL (เช่น /books/1)
	var book models.Book

	// ค้นหาตัวแรกที่เจอ (First) โดยใช้ ID
	result := database.DB.First(&book, id)

	// ถ้าหาไม่เจอ (Error) ให้แจ้งเตือน
	if result.Error != nil {
		return c.Status(404).JSON(fiber.Map{"error": "หาหนังสือไม่เจอจ้า"})
	}

	return c.JSON(book)
}

// 3. CreateBook: เพิ่มหนังสือ (อันเดิม) ➕
func CreateBook(c *fiber.Ctx) error {
	book := new(models.Book)
	if err := c.BodyParser(book); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "ข้อมูลผิดพลาด"})
	}
	database.DB.Create(&book)
	return c.Status(201).JSON(book)
}

// 4. UpdateBook: แก้ไขข้อมูล ✏️
func UpdateBook(c *fiber.Ctx) error {
	id := c.Params("id")
	var book models.Book

	// ขั้นที่ 1: หาของเก่าก่อนว่ามีไหม?
	if err := database.DB.First(&book, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "หาหนังสือไม่เจอ แก้ไขไม่ได้"})
	}

	// ขั้นที่ 2: เอาข้อมูลใหม่มาทับ (Update)
	// ใช้ BodyParser เพื่อดึงข้อมูลใหม่ที่ส่งมา
	if err := c.BodyParser(&book); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "ข้อมูลผิดพลาด"})
	}

	// ขั้นที่ 3: บันทึกการเปลี่ยนแปลง (Save)
	database.DB.Save(&book)

	return c.JSON(book)
}

// 5. DeleteBook: ลบหนังสือ 🗑️
func DeleteBook(c *fiber.Ctx) error {
	id := c.Params("id")
	var book models.Book

	// ขั้นที่ 1: หาของก่อนว่ามีไหม?
	if err := database.DB.First(&book, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "หาหนังสือไม่เจอ ลบไม่ได้"})
	}

	// ขั้นที่ 2: ลบทิ้ง (Delete)
	database.DB.Delete(&book)

	return c.JSON(fiber.Map{"message": "ลบเรียบร้อยแล้วจ้า"})
}
