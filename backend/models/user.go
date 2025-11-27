package models

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Email            string `json:"email" gorm:"unique"` // gorm:"unique" คือห้ามสมัครอีเมลซ้ำ
	Password         string `json:"password"`
	Verified         bool   `json:"verified" gorm:"default:false"` // ยืนยันยัง?
	VerificationCode string `json:"-"`                             // รหัสลับสำหรับยืนยัน (ไม่ส่งให้หน้าบ้านเห็
}
