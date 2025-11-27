package models

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Email    string `json:"email" gorm:"unique"` // gorm:"unique" คือห้ามสมัครอีเมลซ้ำ
	Password string `json:"password"`
}
