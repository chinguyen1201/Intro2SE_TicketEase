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

  // Check for existing auth data on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData, authToken, navigationInfo = null) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Store navigation info if provided
    if (navigationInfo) {
      localStorage.setItem('navigation', JSON.stringify(navigationInfo));
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('navigation');
    
    console.log('User logged out successfully');
  };

  const isAuthenticated = !!user && !!token;

  // Helper functions for role checking
  const isAdmin = () => user?.role === 'admin';
  const isOrganizer = () => user?.role === 'organizer';
  const isCustomer = () => user?.role === 'customer';
  
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
