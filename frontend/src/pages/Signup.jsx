// frontend/src/pages/Signup.jsx
import React, { useState } from 'react';

export default function Signup() {
  const [gender, setGender] = useState('');  

  // Hàm xử lý thay đổi giới tính
  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };

  return (
    <div className="signup-page">
      <header className="navbar">
        <div className="bar container">
          <div className="brand">TicketEase</div>
        </div>
      </header>

      <div className="signup-form">
        <h2>Đăng ký</h2>
        <form>
          <div className="input-group">
            <label>Họ và tên</label>
            <input type="text" placeholder="Nhập họ và tên" required />
          </div>

          <div className="input-group">
            <label>Ngày sinh</label>
            <input type="date" placeholder="Chọn ngày sinh" required />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input type="email" placeholder="Nhập Email" required />
          </div>

          <div className="input-group">
            <label>Số điện thoại</label>
            <input type="text" placeholder="Nhập số điện thoại" required />
          </div>

          <div className="input-group">
            <label>Mật khẩu</label>
            <input type="password" placeholder="Nhập mật khẩu" required />
          </div>

          <div className="input-group">
            <label>Nhập lại mật khẩu</label>
            <input type="password" placeholder="Nhập lại mật khẩu" required />
          </div>

          <div className="gender-group">
            <label>Giới tính</label>
            <div className="gender-options">
              <label>
                <input
                  type="radio"
                  value="male"
                  checked={gender === 'male'}
                  onChange={handleGenderChange}
                />
                Nam
              </label>
              <label>
                <input
                  type="radio"
                  value="female"
                  checked={gender === 'female'}
                  onChange={handleGenderChange}
                />
                Nữ
              </label>
              <label>
                <input
                  type="radio"
                  value="other"
                  checked={gender === 'other'}
                  onChange={handleGenderChange}
                />
                Khác
              </label>
            </div>
          </div>

          <button type="submit" className="btn-primary">Đăng ký</button>
        </form>
        <p className="login-link">
          Đã có tài khoản? <a href="/login">Đăng nhập ngay</a>
        </p>
      </div>
    </div>
  );
}
