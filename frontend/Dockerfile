# ใช้ Node.js เป็นฐาน
FROM node:22-alpine

WORKDIR /app

# ลงโปรแกรมตาม package.json
COPY package.json .
RUN npm install

# ก๊อปโค้ดทั้งหมด
COPY . .

# เปิด Port 5173 (ของ Vite)
EXPOSE 5173

# รันเว็บ (เติม -- --host เพื่อให้เข้าจากเครื่องเราได้)
CMD ["npm", "run", "dev", "--", "--host"]