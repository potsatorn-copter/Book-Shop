package utils

import (
	"fmt"
	"net/smtp"
	"os"
)

func SendVerificationEmail(toEmail string, code string) error {
	// ค่า Config จาก .env
	from := os.Getenv("EMAIL_USER")
	password := os.Getenv("EMAIL_PASS")
	smtpHost := "smtp.gmail.com"
	smtpPort := "587"

	// เนื้อหาอีเมล (HTML)
	// เราจะส่งลิงก์ไปที่ Frontend หน้า verify
	link := fmt.Sprintf("http://localhost:5173/verify?code=%s", code)

	subject := "Subject: ยืนยันอีเมลร้านหนังสือ BookShop\n"
	mime := "MIME-version: 1.0;\nContent-Type: text/html; charset=\"UTF-8\";\n\n"
	body := fmt.Sprintf(`
		<h1>ยินดีต้อนรับ!</h1>
		<p>กรุณากดลิงก์ด้านล่างเพื่อยืนยันอีเมลของคุณ:</p>
		<a href="%s">คลิกที่นี่เพื่อยืนยัน</a>
	`, link)

	msg := []byte(subject + mime + body)

	// ส่งออกไป!
	auth := smtp.PlainAuth("", from, password, smtpHost)
	err := smtp.SendMail(smtpHost+":"+smtpPort, auth, from, []string{toEmail}, msg)
	return err
}
