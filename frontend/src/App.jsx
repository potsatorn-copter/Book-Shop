import { useState } from 'react'
import LoginPage from './LoginPage'
import BookshelfPage from './BookshelfPage' // นำเข้าหน้าที่เราเพิ่งแยก
import './App.css'

function App() {
  // มีแค่ State เดียว คือ Token
  const [token, setToken] = useState(localStorage.getItem('token'))

  const handleLoginSuccess = () => {
    const newToken = localStorage.getItem('token');
    setToken(newToken);
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken(null)
  }

  // Logic การตัดสินใจ (Router Logic)
  // ถ้าไม่มี Token -> โชว์หน้า Login
  if (!token) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />
  }

  // ถ้ามี Token -> โชว์หน้าร้านหนังสือ (ส่งฟังก์ชัน Logout ไปให้ใช้ด้วย)
  return <BookshelfPage onLogout={handleLogout} />
}

export default App