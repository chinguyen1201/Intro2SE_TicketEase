// frontend/src/features/auth/services/authService.js
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

// signup
export async function signup(payload) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let message = "Đăng ký thất bại";
    try {
      const err = await res.json();
      message = err?.message || message;
    } catch {}
    throw new Error(message);
  }
  return res.json();
}

// login - Updated to use query parameters as your API expects
export async function login(username, password) {
  try {
    // Create URL with query parameters
    const url = new URL(`${API_BASE}/auth/login`);
    url.searchParams.append('username', username);
    url.searchParams.append('password', password);

    console.log('Login API URL:', url.toString());

    const res = await fetch(url.toString(), {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
    });

    console.log('Login response status:', res.status);

    if (!res.ok) {
      let msg = 'Đăng nhập thất bại';
      try {
        const errorData = await res.json();
        console.log('Login error data:', errorData);
        
        // Handle FastAPI error format
        if (errorData.detail) {
          if (typeof errorData.detail === 'string') {
            msg = errorData.detail;
          } else if (Array.isArray(errorData.detail)) {
            msg = errorData.detail.map(err => err.msg).join(', ');
          }
        } else if (errorData.message) {
          msg = errorData.message;
        }
      } catch (parseError) {
        console.error("Error parsing login error response:", parseError);
      }
      throw new Error(msg);
    }

    const data = await res.json();
    console.log('Login success data:', data);
    
    return data; // Expected: { access_token, token_type, user_id, user_role }
  } catch (error) {
    console.error('Login API error:', error);
    throw error;
  }
}

// Alternative login function using payload object (for backward compatibility)
export async function loginWithPayload(payload) {
  let username;
  
  // Determine if the payload contains email or phone or direct username
  if (payload.email) {
    username = payload.email;
  } else if (payload.phone) {
    username = payload.phone;
  } else if (payload.username) {
    username = payload.username;
  } else if (payload.id) {
    username = payload.id;
  } else {
    throw new Error('Username, email hoặc phone number là bắt buộc');
  }

  return await login(username, payload.password);
}