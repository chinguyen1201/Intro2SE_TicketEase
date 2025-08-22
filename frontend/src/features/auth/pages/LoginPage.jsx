// frontend/src/features/auth/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Header from '../../../components/Header';


export default function Login() {
  const navigate = useNavigate();
  const { login: loginContext } = useAuth();

  const [form, setForm] = useState({ id: '', password: '' }); // id = username, email hoặc SĐT
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");
    if (!form.id.trim() || !form.password) {
      setErrorMsg("Vui lòng nhập đầy đủ Username/Email/SĐT và mật khẩu");
      return;
    }
    
  };

  return (
    <>
      <Header/>
      <div className="login-page">
        <div className="login-container">
          <div className="login-form">
            <h2>Đăng nhập</h2>

            {errorMsg ? <p style={{color: 'red'}}>{errorMsg}</p> : null}

            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Username/Email/Số điện thoại</label>
                <input
                  name="id"
                  type="text"
                  placeholder="Nhập Username, Email hoặc SĐT"
                  value={form.id}
                  onChange={onChange}
                  required
                />
              </div>

              <div className="input-group">
                <label>Mật khẩu</label>
                <input
                  name="password"
                  type="password"
                  placeholder="Nhập mật khẩu"
                  value={form.password}
                  onChange={onChange}
                  required
                />
              </div>

              <div className="forgot-password">
                <a href="#">Quên mật khẩu?</a>
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </button>
            </form>

            <p className="signup-link">
              Bạn mới biết đến TicketEase? <Link to="/signup">Đăng ký ngay</Link>
            </p>
            
            {/* Debug info - remove in production */}
            {process.env.NODE_ENV === 'development' && (
              <div style={{marginTop: '20px', fontSize: '12px', color: '#666'}}>
                <details>
                  <summary>Debug Info (Dev Only)</summary>
                  <p>API Endpoint: POST /auth/login</p>
                  <p>Example: localhost:3000/auth/login?username=anhchi1&password=anhchi</p>
                </details>
              </div>
            )}
            {/* Fake login */}
            {/* Add this simple fake login button below the form */}
            <button
              type="button"
              className="btn-secondary"
              style={{ marginTop: 16 }}
              onClick={() => {
                // Simulate a successful login
                const fakeUser = { id: 1, role: 'user', username: 'fakelogin' };
                localStorage.setItem('token', 'fake_token');
                localStorage.setItem('user', JSON.stringify(fakeUser));
                localStorage.setItem('userId', '1');
                localStorage.setItem('userRole', 'user');
                // Optionally, update context if needed
                window.location.href = '/'; // Redirect to homepage
              }}
            >
              Fake Login (Dev Only)
            </button> 
            {/* Fake login */}
          </div>
        </div>
      </div>
    </>
  );
}
