// frontend/src/features/auth/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Header from '../../../components/Header';
import { login as loginAPI, loginWithPayload } from '../services/authService'; // gọi API

export default function Login() {
  const navigate = useNavigate();
  const { login: loginContext } = useAuth();

  const [form, setForm] = useState({ id: '', password: '' }); // id = username, email hoặc SĐT
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!form.id.trim() || !form.password) {
      setErrorMsg('Vui lòng nhập đầy đủ Username/Email/SĐT và mật khẩu');
      return;
    }

    setLoading(true);
    try {
      // Call the API with username and password as query parameters
      const data = await loginAPI(form.id.trim(), form.password);
      
      console.log('Login API response:', data);

      // Expected response format:
      // {
      //   "access_token": "...",
      //   "token_type": "bearer", 
      //   "user_id": 1,
      //   "user_role": "user"
      // }

      if (data.access_token && data.user_id) {
        // Create user object for context
        const user = {
          id: data.user_id,
          role: data.user_role || 'user',
          username: form.id.trim() // Store the username used for login
        };

        console.log('Login - User object created:', user);
        console.log('Login - API response:', data);

        // Use auth context to handle login
        loginContext(user, data.access_token);
        
        console.log(`Login successful for ${data.user_role} user`);
        
        // Always redirect to homepage to show logged-in navbar
        navigate('/', { replace: true });
      } else {
        setErrorMsg('Dữ liệu đăng nhập không hợp lệ');
      }
    } catch (err) {
      console.error('Login error:', err);
      setErrorMsg(err?.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
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
          </div>
        </div>
      </div>
    </>
  );
}
