// frontend/src/components/Navbar.jsx
import { FiSearch } from 'react-icons/fi'
import { RiTicket2Line } from 'react-icons/ri'
import { Link } from 'react-router-dom';

export default function Navbar(){
  return (
    <header className="navbar">
      <div className="bar">
        <div className="container">
          <Link to="/" className="brand">TicketEase</Link>
          <div className="search">
            <div className="search-field">
              <span className="search-ico" aria-hidden><FiSearch size={18}/></span>
              <input placeholder="Bạn tìm gì hôm nay?" />
            </div>
          </div>

          <nav className="nav-actions">
            <button className="btn-outline btn-cta">Tạo sự kiện</button>
            
            <a className="nav-ticket" href="#">
              <span className="ico-ticket" aria-hidden><RiTicket2Line size={18}/></span>
              Vé của tôi
            </a>

            <span className="auth">
              <Link to="/login">Đăng nhập</Link>
              <span className="sep">|</span>
              <Link to="/signup">Đăng ký</Link>
            </span>
          </nav>
        </div>
      </div>

      {/* Dải chuyên mục */}
      <div className="catbar">
        <div className="container">
          <nav className="cats">
            <a href="#">Nhạc sống</a>
            <a href="#">Sân khấu & Nghệ thuật</a>
            <a href="#">Thể thao</a>
            <a href="#">Khác</a>
          </nav>
        </div>
      </div>
    </header>
  )
}
