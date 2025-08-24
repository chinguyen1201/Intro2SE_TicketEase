// frontend/src/components/NavbarLoggedIn.jsx
import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { RiTicket2Line } from 'react-icons/ri';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { MdArrowDropDown, MdEvent, MdAdminPanelSettings } from "react-icons/md";
import { FaRegUser, FaRegCircleUser, FaCrown } from "react-icons/fa6";
import { LuLogOut } from "react-icons/lu";
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../context/authSlides.jsx';

export default function NavbarLoggedIn() {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const { user, isAdmin } = useSelector(state => state.auth);
  const navigate = useNavigate();

  // Helper functions for role checking
  const isOrganizer = user?.role === 'organizer';
  const isCustomer = user?.role === 'user';

  const toggleDropdown = () => setDropdownOpen(v => !v);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.clear();
    setDropdownOpen(false);
    navigate('/', { replace: true });
  };

  // Role-based styling
  const getRoleColor = () => {
    if (isAdmin) return 'text-red-600';
    if (isOrganizer) return 'text-blue-600';
    return 'text-gray-700';
  };

  const getRoleBadge = () => {
    if (isAdmin) return { icon: <FaCrown size={14} />, text: 'Admin', color: 'bg-red-100 text-red-800' };
    if (isOrganizer) return { icon: <MdEvent size={14} />, text: 'Organizer', color: 'bg-blue-100 text-blue-800' };
    return null;
  };

  return (
    <header className="navbar">
      <div className="bar">
        <div className="container">
          <Link to="/" className="brand">TicketEase</Link>

          <div className="search">
            <div className="search-field">
              <span className="search-ico" aria-hidden><FiSearch size={18} /></span>
              <input placeholder="Bạn tìm gì hôm nay?" />
            </div>
          </div>

          <div className="nav-actions">
            {/* Role-based navigation buttons */}
            {isAdmin && (
              <NavLink to="/admin/dashboard" className="btn-outline btn-cta">
                <MdAdminPanelSettings size={18} style={{ marginRight: 4 }} />
                Admin Panel
              </NavLink>
            )}

            {/* Event creation for customers and organizers (not admin) */}
            {(isOrganizer || isCustomer) && (
              <NavLink to="/createevent" className="btn-outline btn-cta">
                Tạo sự kiện
              </NavLink>
            )}

            {/* Customer-specific features */}
            {(isCustomer || isOrganizer) && (
              <NavLink to="/purchasehistory" className="nav-ticket">
                <span className="ico-ticket" aria-hidden><RiTicket2Line size={18} /></span>
                Vé của tôi
              </NavLink>
            )}

            {/* Account dropdown */}
            <div className="dropdown" style={{ position: 'relative' }}>
              <button onClick={toggleDropdown} className="btn-cta dropdown-toggle">
                <FaRegUser style={{ marginRight: 4, marginLeft: 4 }} />
                <div className="flex flex-col items-start">
                  <span className={getRoleColor()}>
                    {user?.name || 'Tài khoản'}
                  </span>
                  {getRoleBadge() && (
                    <span className={`text-xs px-1 py-0 rounded-full flex items-center gap-1 ${getRoleBadge().color}`}>
                      {getRoleBadge().icon}
                      {getRoleBadge().text}
                    </span>
                  )}
                </div>
                <MdArrowDropDown style={{ marginLeft: 4 }} />
              </button>

              {isDropdownOpen && (
                <div
                  className="absolute mt-1 bg-white rounded-xl shadow-lg py-2 border border-gray-200"
                  style={{ minWidth: '220px', width: 'max-content', right: 0, zIndex: 1000 }}
                >
                  {/* Admin-specific menu items */}
                  {isAdmin && (
                    <>
                      <NavLink
                        to="/admin/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-b border-gray-200"
                      >
                        <MdAdminPanelSettings size={18} />
                        Bảng điều khiển Admin
                      </NavLink>
                    </>
                  )}

                  {/* Organizer-specific menu items */}
                  {(isOrganizer || isCustomer) && (
                    <NavLink
                      to="/eventlist"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-200"
                    >
                      <MdEvent size={18} />
                      Sự kiện của tôi
                    </NavLink>
                  )}

                  {/* Customer-specific menu items */}
                  {(isCustomer || isOrganizer) && (
                    <NavLink
                      to="/purchasehistory"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-200"
                    >
                      <RiTicket2Line size={18} />
                      Vé của tôi
                    </NavLink>
                  )}

                  {/* Common menu items */}
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
                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LuLogOut size={18} />
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

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
  );
}
