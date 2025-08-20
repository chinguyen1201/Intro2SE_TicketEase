// frontend/src/features/auth/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Header from '../../../components/Header';
import { login as loginAPI } from '../services/authService'; // gọi API

export default function Login() {
  const navigate = useNavigate();
  const { login: loginContext } = useAuth();

  const [form, setForm] = useState({ id: '', password: '' }); // id = email hoặc SĐT
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!form.id.trim() || !form.password) {
      setErrorMsg('Vui lòng nhập đầy đủ Email/SĐT và mật khẩu');
      return;
    }

    // tách email/phone theo định dạng
    const isEmail = /\S+@\S+\.\S+/.test(form.id);
    const payload = { password: form.password };
    if (isEmail) payload.email = form.id;
    else payload.phone = form.id;

    setLoading(true);
    try {
      const data = await loginAPI(payload);

      // Use auth context to handle login with role-based navigation
      const token = data.token || data.accessToken;
      if (token && data.user) {
        // Pass navigation info to login context
        loginContext(data.user, token, data.navigation);
        
        // Determine redirect path based on user role
        const redirectPath = data.navigation?.redirect_to || '/';
        
        console.log(`Redirecting ${data.user.role} to ${redirectPath}`);
        navigate(redirectPath, { replace: true });
      } else {
        setErrorMsg('Dữ liệu đăng nhập không hợp lệ');
      }
    } catch (err) {
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
                <label> Email/Số điện thoại</label>
                <input
                  name="id"
                  type="text"
                  placeholder="Nhập Email hoặc SĐT"
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
          </div>
        </div>
      </div>
    </>
  );
}
