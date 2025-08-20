// frontend/src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [logoutSuccess, setLogoutSuccess] = useState(false);

  // Check for existing auth data on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const storedUserId = localStorage.getItem('userId');
    const storedUserRole = localStorage.getItem('userRole');
    
    if (storedToken && (storedUser || (storedUserId && storedUserRole))) {
      try {
        setToken(storedToken);
        
        // Use stored user object or create from individual fields
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else if (storedUserId && storedUserRole) {
          setUser({
            id: storedUserId,
            role: storedUserRole
          });
        }
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        // Clear all auth data if parsing fails
        localStorage.removeItem('token');
        localStorage.removeItem('tokenType');
        localStorage.removeItem('userId');
        localStorage.removeItem('userRole');
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData, authToken, navigationInfo = null) => {
    console.log('AuthContext login called with:', { userData, authToken });
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Also store individual user fields for consistency
    if (userData.id) localStorage.setItem('userId', userData.id);
    if (userData.role) localStorage.setItem('userRole', userData.role);
    
    // Store navigation info if provided
    if (navigationInfo) {
      localStorage.setItem('navigation', JSON.stringify(navigationInfo));
    }
    
    // Clear any logout success state
    setLogoutSuccess(false);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('tokenType');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('user');
    localStorage.removeItem('navigation');
    
    // Show logout success message
    setLogoutSuccess(true);
    
    // Hide logout success message after 3 seconds
    setTimeout(() => setLogoutSuccess(false), 3000);
    
    console.log('User logged out successfully');
  };

  const isAuthenticated = !!user && !!token;

  // Helper functions for role checking
  const isAdmin = () => user?.role === 'admin';
  const isOrganizer = () => user?.role === 'organizer';
  const isCustomer = () => user?.role === 'user' || user?.role === 'customer'; // Support both 'user' and 'customer'
  
  // Get user's default redirect path
  const getDefaultRedirect = () => {
    const storedNavigation = localStorage.getItem('navigation');
    if (storedNavigation) {
      try {
        const nav = JSON.parse(storedNavigation);
        return nav.redirect_to || '/';
      } catch (error) {
        console.error('Error parsing navigation data:', error);
      }
    }
    
    // Fallback based on user role
    if (user?.role === 'admin') return '/admin/dashboard';
    if (user?.role === 'organizer') return '/organizer/dashboard';
    return '/';
  };

  // Check if user has specific permission
  const hasPermission = (permission) => {
    const storedNavigation = localStorage.getItem('navigation');
    if (storedNavigation) {
      try {
        const nav = JSON.parse(storedNavigation);
        return nav.permissions?.includes(permission) || false;
      } catch (error) {
        console.error('Error parsing navigation data:', error);
      }
    }
    return false;
  };

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated,
    logoutSuccess,
    login,
    logout,
    isAdmin,
    isOrganizer,
    isCustomer,
    getDefaultRedirect,
    hasPermission
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
