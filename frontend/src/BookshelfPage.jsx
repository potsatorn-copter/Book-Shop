import { useState, useEffect, useCallback } from 'react'
import { getBooks, createBook, deleteBook, updateBook } from './api'
import './Bookshelf.css'

const getBookColor = (id) => {
  const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f1c40f', '#9b59b6', '#34495e', '#1abc9c', '#d35400'];
  return colors[id % colors.length];
}

function BookshelfPage({ onLogout }) {
  const [books, setBooks] = useState([])
  const [newBookTitle, setNewBookTitle] = useState("")

  // ✅ ใช้ useCallback เพื่อแช่แข็งฟังก์ชันนี้ แก้ปัญหา Hook dependency
  const fetchBooks = useCallback(async () => {
    try {
      const response = await getBooks()
      const booksWithColor = response.data.map(book => ({
        ...book,
        color: getBookColor(book.ID)
      }))
      setBooks(booksWithColor)
    } catch (error) {
      if (error.response && error.response.status === 401) {
        onLogout() // Token หมดอายุ ให้เด้งออก
      }
    }
  }, [onLogout]) // ปิดวงเล็บให้ครบตรงนี้

  useEffect(() => {
    fetchBooks()
  }, [fetchBooks]) // ใส่ fetchBooks เป็น dependency ได้อย่างปลอดภัย

  const handleAddBook = async (e) => {
    e.preventDefault()
    if (!newBookTitle) return
    try {
      await createBook({ title: newBookTitle })
      setNewBookTitle("")
      fetchBooks()
    } catch (error) {
      alert("เพิ่มไม่สำเร็จ")
      console.error(error)
    }
  }

  const handleEditBook = async (book) => {
    const newTitle = prompt("แก้ไขชื่อหนังสือ:", book.title);
    if (newTitle === null || newTitle === book.title || newTitle.trim() === "") return;
    try {
      await updateBook(book.ID, { title: newTitle })
      fetchBooks()
    } catch (error) {
      alert("แก้ไขไม่ได้")
      console.error(error)
    }
  }

  const handleDeleteBook = async (id) => {
    if(!confirm("จะลบเล่มนี้จริงหรอ?")) return;
    try {
      await deleteBook(id)
      fetchBooks()
    } catch (error) {
      alert("ลบไม่ได้")
      console.error(error)
    }
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>📚 My Awesome Bookshelf</h1>
        <button onClick={onLogout} style={{ backgroundColor: '#e74c3c' }}>ออกจากระบบ</button>
      </div>
      
      <p>ยินดีต้อนรับ! (โหมดสมาชิก)</p>

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

      <div className="bookshelf">
        {books.length === 0 ? (
          <p style={{width: '100%', color: '#888'}}>กำลังโหลดข้อมูล... หรือยังไม่มีหนังสือ</p>
        ) : (
          books.map((book) => (
            <div 
              key={book.ID} 
              className="book-item"
              style={{ backgroundColor: book.color }} 
              onClick={() => handleEditBook(book)} 
              title="กดเพื่อแก้ไขชื่อ"
            >
              {book.title}
              <div 
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation(); 
                  handleDeleteBook(book.ID);
                }}
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

export default BookshelfPage