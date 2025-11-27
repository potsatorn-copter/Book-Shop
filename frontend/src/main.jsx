import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
// 👇 1. นำเข้า
import { GoogleOAuthProvider } from '@react-oauth/google';

// 👇 2. ใส่ Client ID ของคุณตรงนี้
const GOOGLE_CLIENT_ID = "946943250997-3f499duk08o9lstpga8akrodmmru9vsq.apps.googleusercontent.com"; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 3. ห่อ App ไว้ข้างใน */}
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>,
)