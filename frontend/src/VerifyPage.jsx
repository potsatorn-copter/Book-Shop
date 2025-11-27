import { useEffect, useState } from 'react'
import axios from 'axios'

function VerifyPage() {
  const [status, setStatus] = useState("กำลังยืนยัน...")

  useEffect(() => {
    // ดึง code จาก URL (http://localhost:5173/verify?code=...)
    const params = new URLSearchParams(window.location.search)
    const code = params.get("code")

    if (code) {
      // ส่งไปบอก Backend ให้ยืนยัน
      axios.get(`http://localhost:8080/verify-email?code=${code}`)
        .then(() => setStatus("ยืนยันสำเร็จ! 🎉 กรุณาปิดหน้านี้และไปล็อกอิน"))
        .catch(() => setStatus("รหัสไม่ถูกต้อง หรือยืนยันไปแล้ว ❌"))
    } else {
        setStatus("ไม่พบรหัสยืนยัน")
    }
  }, [])

  return (
    <div className="container" style={{textAlign: 'center', marginTop: '100px'}}>
      <h1>{status}</h1>
    </div>
  )
}

export default VerifyPage