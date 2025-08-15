import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header'

export default function Login() {
  return (
    <div className="login-page">
      <Header/>
      <div className="login-container">
        <div className="login-form">
          <h2>Đăng nhập</h2>
          <form>
            <div className="input-group">
              <label>Email/Số điện thoại</label>
              <input type="text" placeholder="Nhập Email hoặc SĐT" />
            </div>
            <div className="input-group">
              <label>Mật khẩu</label>
              <input type="password" placeholder="Nhập mật khẩu" />
            </div>
            <div className="forgot-password">
              <a href="#">Quên mật khẩu?</a>
            </div>
            <button type="submit" className="btn-primary">Đăng nhập</button>
          </form>
          <p className="signup-link">
            Bạn mới biết đến TicketEase? <Link to="/signup">Đăng ký ngay</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
