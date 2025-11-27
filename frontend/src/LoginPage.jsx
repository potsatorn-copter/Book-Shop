import { useState } from 'react'
import { login, register, googleLogin } from './api' // import googleLogin เพิ่ม
import './App.css'
import { GoogleLogin } from '@react-oauth/google'; // ปุ่มสำเร็จรูป

function LoginPage({ onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  // ฟังก์ชันเดิม (Email/Pass)
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (isRegister) {
        await register({ email, password })
        alert("สมัครสำเร็จ! กรุณาล็อกอิน")
        setIsRegister(false)
      } else {
        const response = await login({ email, password })
        localStorage.setItem('token', response.data.token)
        alert("ยินดีต้อนรับ!")
        onLoginSuccess() 
      }
    } catch (error) {
      console.error(error)
      alert("เกิดข้อผิดพลาด: " + (error.response?.data?.error || "Unknown Error"))
    }
  }

  // ✨ ฟังก์ชันใหม่: รับ Token จาก Google แล้วส่งไปหลังบ้าน
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      // ส่ง ID Token ที่ได้จาก Google ไปให้ Backend เรา
      const response = await googleLogin(credentialResponse.credential)
      
      // Backend ตอบกลับมาเป็น Token ของร้านเรา -> เก็บลงเครื่อง
      localStorage.setItem('token', response.data.token)
      alert("ล็อกอินผ่าน Google สำเร็จ!")
      onLoginSuccess()
    } catch (error) {
      console.error("Google Login Error:", error)
      alert("ล็อกอินด้วย Google ไม่สำเร็จ")
    }
  }

  return (
    <div className="container" style={{ marginTop: '100px' }}>
      <h1>🔐 {isRegister ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ'}</h1>
      <div className="input-group">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input type="email" placeholder="อีเมล" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="รหัสผ่าน" value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="submit">{isRegister ? 'ยืนยันการสมัคร' : 'ล็อกอินเข้าใช้งาน'}</button>
        </form>
        
        {/* เส้นคั่นสวยๆ */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
          <hr style={{ flex: 1 }} /> <span style={{ padding: '0 10px', color: '#888' }}>หรือ</span> <hr style={{ flex: 1 }} />
        </div>

        {/* 🔘 ปุ่ม Google Login (ของแท้จาก Google) */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => {
                    console.log('Login Failed');
                }}
            />
        </div>

        <p style={{ marginTop: '20px', cursor: 'pointer', color: 'blue' }} 
           onClick={() => setIsRegister(!isRegister)}>
           {isRegister ? 'มีบัญชีแล้ว? ไปล็อกอิน' : 'ยังไม่มีบัญชี? สมัครสมาชิก'}
        </p>
      </div>
    </div>
  )
}

export default LoginPage