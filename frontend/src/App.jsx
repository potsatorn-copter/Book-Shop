import { useState, useEffect } from 'react'
// ⚠️ อย่าลืมเช็คไฟล์ api.js ว่า export updateBook ออกมาด้วยนะครับ
import { getBooks, createBook, deleteBook, updateBook } from './api'
import './App.css'

// ฟังก์ชันสุ่มสี (แบบล็อคสีตาม ID)
// ID เดิม จะได้สีเดิมเสมอ ไม่ว่าจะรีเฟรชกี่รอบ
const getBookColor = (id) => {
  const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f1c40f', '#9b59b6', '#34495e', '#1abc9c', '#d35400'];
  return colors[id % colors.length];
}

function App() {
  const [books, setBooks] = useState([])
  const [newBookTitle, setNewBookTitle] = useState("")

  // 1. โหลดข้อมูล
  const fetchBooks = async () => {
    try {
      const response = await getBooks()
      // เติมสีให้หนังสือแต่ละเล่มตาม ID
      const booksWithColor = response.data.map(book => ({
        ...book,
        color: getBookColor(book.ID)
      }))
      setBooks(booksWithColor)
    } catch (error) {
      console.error(error)
    }
  }

  // โหลดครั้งแรกตอนเปิดเว็บ
  useEffect(() => {
    // eslint-disable-next-line
    fetchBooks()
  }, [])

  // 2. เพิ่มหนังสือ (Create)
  const handleAddBook = async (e) => {
    e.preventDefault()
    if (!newBookTitle) return

    try {
      await createBook({ title: newBookTitle })
      setNewBookTitle("")
      fetchBooks()
    } catch (error) {
      console.error(error)
      alert("เพิ่มหนังสือไม่สำเร็จ")
    }
  }

  // 3. แก้ไขหนังสือ (Update) ✨
  const handleEditBook = async (book) => {
    // ใช้ prompt เด้งถาม (ง่ายและเร็วสำหรับมือใหม่)
    const newTitle = prompt("แก้ไขชื่อหนังสือ:", book.title);

    // ถ้ากด Cancel หรือไม่ได้พิมพ์อะไร ก็ไม่ต้องทำต่อ
    if (newTitle === null || newTitle === book.title || newTitle.trim() === "") return;

    try {
      await updateBook(book.ID, { title: newTitle })
      fetchBooks() // โหลดหน้าใหม่
    } catch (error) {
      console.error(error)
      alert("แก้ไขไม่ได้จ้า")
    }
  }

  // 4. ลบหนังสือ (Delete)
  const handleDeleteBook = async (id) => {
    if(!confirm("จะลบเล่มนี้จริงหรอ?")) return;
    try {
      await deleteBook(id)
      fetchBooks()
    } catch (error) {
      console.error(error)
      alert("ลบไม่ได้จ้า")
    }
  }

  return (
    <div className="container">
      <h1>📚 My Awesome Bookshelf</h1>
      <p>จิ้มที่ตัวหนังสือเพื่อแก้ไข / จิ้มที่ X เพื่อลบ</p>

      {/* โซนกรอกข้อมูล */}
      <div className="input-group">
        <form onSubmit={handleAddBook}>
          <input 
            type="text" 
            placeholder="ชื่อหนังสือเล่มโปรด..." 
            value={newBookTitle}
            onChange={(e) => setNewBookTitle(e.target.value)}
          />
          <button type="submit">วางบนชั้นเลย!</button>
        </form>
      </div>

      {/* โซนชั้นวางหนังสือ */}
      <div className="bookshelf">
        {books.length === 0 ? (
          <p style={{width: '100%', color: '#888'}}>ยังไม่มีหนังสือเลย... รีบเติมหน่อย!</p>
        ) : (
          books.map((book) => (
            <div 
              key={book.ID} 
              className="book-item"
              style={{ backgroundColor: book.color }} 
              
              /* 👇 คลิกที่ตัวหนังสือ = แก้ไข */
              onClick={() => handleEditBook(book)} 
              title="กดเพื่อแก้ไขชื่อ"
            >
              {book.title}

              {/* 👇 ปุ่มลบ (X) มุมขวาบน */}
              <div 
                className="delete-btn"
                /* 🛑 stopPropagation สำคัญมาก! กันไม่ให้ไปโดนคำสั่งแก้ไข */
                onClick={(e) => {
                  e.stopPropagation(); 
                  handleDeleteBook(book.ID);
                }}
                title="ลบเล่มนี้"
              >
                ✕
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default App