package main

import (
	"my-shop/controllers"
	"my-shop/database"

	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	database.Connect()

	app := fiber.New()
	app.Use(cors.New(cors.Config{AllowOrigins: "*"}))

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("API พร้อมใช้งานแล้ว!")
	})

	// --- CRUD Routes ---

	// 1. ดูทั้งหมด
	app.Get("/books", controllers.GetBooks)

	// 2. ดูเล่มเดียว (สังเกต :id คือตัวแปรที่รับค่าได้)
	app.Get("/books/:id", controllers.GetBook)

	// 3. สร้างใหม่
	app.Post("/books", controllers.CreateBook)

	// 4. แก้ไข (ใช้ PUT)
	app.Put("/books/:id", controllers.UpdateBook)

	// 5. ลบ (ใช้ DELETE)
	app.Delete("/books/:id", controllers.DeleteBook)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// app.Listen(":8080")  <-- ลบอันนี้ทิ้ง
	app.Listen(":" + port) // <-- ใช้อันนี้แทน
}
