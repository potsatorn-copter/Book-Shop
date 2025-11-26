package database

import (
	"fmt"
	"os"

	"my-shop/models"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect() {
	err := godotenv.Load()
	if err != nil {
		fmt.Println("ไม่เจอไฟล์ .env (ไม่เป็นไรถ้าอยู่บน Server)")
	}

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
		os.Getenv("DB_PORT"),
	)

	database, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("เชื่อมต่อ Database ไม่ได้!")
	}

	// เรียกใช้ Book จาก package models
	database.AutoMigrate(&models.Book{})

	DB = database
	fmt.Println("✅ เชื่อมต่อ Database และแยกไฟล์สำเร็จ!")
}
