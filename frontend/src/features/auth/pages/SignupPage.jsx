// frontend/src/features/auth/pages/SignupPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Header from '../../../components/Header';
import { signup as signupAPI } from '../services/authService'; // gọi API

export default function SignupPage() {
  const navigate = useNavigate();
  const { login: loginContext } = useAuth();

  // state form
  const [form, setForm] = useState({
    fullName: '',
    dob: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    gender: '', // 'male' | 'female' | 'other'
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    if (!form.fullName.trim()) return 'Vui lòng nhập họ và tên';
    if (!form.email.trim()) return 'Vui lòng nhập email';
    if (!/\S+@\S+\.\S+/.test(form.email)) return 'Email không hợp lệ';
    if (!form.password || form.password.length < 6) return 'Mật khẩu tối thiểu 6 ký tự';
    if (form.password !== form.confirmPassword) return 'Mật khẩu nhập lại không khớp';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (v) {
      setErrorMsg(v);
      return;
    }
    setErrorMsg('');
    setLoading(true);
    try {
      const data = await signupAPI({
        name: form.fullName,
        email: form.email,
        password: form.password,
        phone: form.phone || null,
        gender: form.gender || null,
        dob: form.dob || null,
      });
      
      // Auto-login after successful signup
      const token = data.token || data.accessToken;
      if (token && data.user) {
        loginContext(data.user, token);
        navigate('/', { replace: true }); // Go directly to homepage with logged in status
      } else {
        // Fallback: if no token, redirect to login page
        navigate('/login', { state: { signedUp: true } });
      }
    } catch (err) {
      setErrorMsg(err?.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="signup-page">
        <div className="signup-container">
          <div className="signup-form">
            <h2>Đăng ký</h2>

            {errorMsg ? <p style={{color: 'red'}}>{errorMsg}</p> : null}

            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Họ và tên</label>
                <input
                  name="fullName"
                  type="text"
                  placeholder="Nhập họ và tên"
                  required
                  value={form.fullName}
                  onChange={onChange}
                />
              </div>

              <div className="input-group">
                <label>Ngày sinh</label>
                <input
                  name="dob"
                  type="date"
                  placeholder="Chọn ngày sinh"
                  value={form.dob}
                  onChange={onChange}
                />
              </div>

              <div className="input-group">
                <label>Email</label>
                <input
                  name="email"
                  type="email"
                  placeholder="Nhập Email"
                  required
                  value={form.email}
                  onChange={onChange}
                />
              </div>

              <div className="input-group">
                <label>Số điện thoại</label>
                <input
                  name="phone"
                  type="text"
                  placeholder="Nhập số điện thoại"
                  value={form.phone}
                  onChange={onChange}
                />
              </div>

              <div className="input-group">
                <label>Mật khẩu</label>
                <input
                  name="password"
                  type="password"
                  placeholder="Nhập mật khẩu"
                  required
                  value={form.password}
                  onChange={onChange}
                />
              </div>

              <div className="input-group">
                <label>Nhập lại mật khẩu</label>
                <input
                  name="confirmPassword"
                  type="password"
                  placeholder="Nhập lại mật khẩu"
                  required
                  value={form.confirmPassword}
                  onChange={onChange}
                />
              </div>

              <div className="gender-group">
                <label>Giới tính</label>
                <div className="gender-options">
                  <label>
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={form.gender === 'male'}
                      onChange={onChange}
                    />
                    Nam
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={form.gender === 'female'}
                      onChange={onChange}
                    />
                    Nữ
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="gender"
                      value="other"
                      checked={form.gender === 'other'}
                      onChange={onChange}
                    />
                    Khác
                  </label>
                </div>
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Đang tạo tài khoản...' : 'Đăng ký'}
              </button>
            </form>

            <p className="login-link">
              Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
