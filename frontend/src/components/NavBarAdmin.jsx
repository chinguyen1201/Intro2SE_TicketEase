// frontend/src/components/NavbarAdmin.jsx
import React, { useState } from 'react';
import { MdArrowDropDown } from 'react-icons/md';
import { FaRegUser, FaRegCircleUser } from 'react-icons/fa6';
import { LuLogOut } from 'react-icons/lu';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../context/authSlides.jsx';

export default function NavbarAdmin() {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleDropdown = () => setDropdownOpen(v => !v);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.clear();
    navigate('/', { replace: true });
  };

  return (
    <header className="navbar">
      <div className="bar">
        <div className="container">
          <div className="brand">TicketEase</div>

          {/* Giữ khối search để làm spacer nhưng ẩn nội dung */}
          <div className="search" aria-hidden style={{ visibility: 'hidden' }}>
            <div className="search-field">
              {/* Giữ structure để giữ nguyên bề rộng, nhưng không cần icon/search thực tế */}
              <input placeholder=" " readOnly />
            </div>
          </div>

          <div className="nav-actions">
            {/* Chỉ còn dropdown Tài khoản */}
            <div className="dropdown" style={{ position: 'relative' }}>
              <button onClick={toggleDropdown} className="btn-cta dropdown-toggle">
                <FaRegUser style={{ marginRight: 4, marginLeft: 4 }} />
                Tài khoản
                <MdArrowDropDown style={{ marginLeft: 4 }} />
              </button>

              {isDropdownOpen && (
                <div
                  className="absolute mt-1 bg-white rounded-xl shadow-lg py-2 border border-gray-200"
                  style={{ minWidth: '200px', width: 'max-content', right: 0, zIndex: 1000 }}
                >
                  <NavLink
                    to="/account"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-200"
                  >
                    <FaRegCircleUser size={18} />
                    Tài khoản của tôi
                  </NavLink>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    <LuLogOut size={18} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
