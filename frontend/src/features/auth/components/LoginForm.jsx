import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { setUsername, setPassword, setLoading, setErrorMessage, setSuccessMessage, clearMessages, login, logout } from '../../../context/authSlides.jsx'; // Import action creators

export function LoginForm({ className, ...props }) {
    const dispatch = useDispatch();
    const {
        isAuthenticated,
        user,
        token,
        username,
        password,
        errorMessage,
        successMessage,
        isLoading
    } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    // Helper to render error messages safely
    const renderErrorMessage = (msg) => {
        if (!msg) return null;
        if (typeof msg === 'string') return msg;
        if (Array.isArray(msg)) {
            // If array of objects with msg property (FastAPI validation error)
            return msg.map((item, idx) => item.msg || JSON.stringify(item)).join(' ');
        }
        if (typeof msg === 'object') {
            // If object with msg/detail/message
            return msg.message || msg.detail || JSON.stringify(msg);
        }
        return String(msg);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        dispatch(setLoading(true));
        dispatch(clearMessages());

        try {
            // Send username and password as query parameters (not in body)
            const params = new URLSearchParams({ username, password });
            const response = await fetch(`http://localhost:3000/auth/login?${params.toString()}`, {
                method: 'POST',
            });

            if (!response.ok) {
                const error = await response.json();
                console.error("Login failed:", error);
                // Prefer error.message, then error.detail, then fallback
                const errorMsg = error.message || error.detail || 'Login failed';
                dispatch(setErrorMessage(errorMsg));
                dispatch(setLoading(false));
                return;
            }

            const result = await response.json();

            // Store in localStorage
            localStorage.setItem('token_type', result.token_type);
            localStorage.setItem('username', result.username);
            localStorage.setItem('user_id', result.user_id);
            localStorage.setItem('access_token', result.access_token);
            localStorage.setItem('user', JSON.stringify(result.user));

            // Update Redux store, ensure username is set
            dispatch(login({ ...result, username: result.user?.username }));
            dispatch(setSuccessMessage(result.message));

            console.log("Result: ", result);

            // Redirect to the homepage
            navigate('/');

        } catch (error) {
            console.error(error);
            dispatch(setLoading(false));
            dispatch(setErrorMessage(error.message || 'Đã xảy ra lỗi kết nối'));
        }
    };

    return (
        <div className="login-form">
            <h2>Đăng nhập</h2>

            {errorMessage && <p style={{ color: 'red' }}>{renderErrorMessage(errorMessage)}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

            <form onSubmit={handleLogin}>
                <div className="input-group">
                    <label>Tên đăng nhập</label>
                    <input
                        name="id"
                        type="text"
                        placeholder="Nhập Tên đăng nhập"
                        value={username}
                        onChange={(e) => dispatch(setUsername(e.target.value))}
                        required
                    />
                </div>

                <div className="input-group">
                    <label>Mật khẩu</label>
                    <input
                        name="password"
                        type="password"
                        placeholder="Nhập mật khẩu"
                        value={password}
                        onChange={(e) => dispatch(setPassword(e.target.value))}
                        required
                    />
                </div>

                <div className="forgot-password">
                    <a href="#">Quên mật khẩu?</a>
                </div>

                <button type="submit" className="btn-primary" disabled={isLoading}>
                    {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </button>
            </form>

            <p className="signup-link">
                Bạn mới biết đến TicketEase? <Link to="/signup">Đăng ký ngay</Link>
            </p>

            {/* Debug info - remove in production */}
            {process.env.NODE_ENV === 'development' && (
                <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
                    <details>
                        <summary>Debug Info (Dev Only)</summary>
                        <p>API Endpoint: POST /auth/login</p>
                        <p>Example: localhost:3000/auth/login?username=anhchi1&password=anhchi</p>
                    </details>
                </div>
            )}
        </div>
    )
}