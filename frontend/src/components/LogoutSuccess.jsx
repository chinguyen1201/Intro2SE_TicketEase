// frontend/src/components/LogoutSuccess.jsx
import React, { useEffect, useState } from 'react';

const LogoutSuccess = ({ show, onClose }) => {
  const [visible, setVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      setIsExiting(false);
      
      const timer = setTimeout(() => {
        setIsExiting(true);
        // Wait for animation to complete before hiding
        setTimeout(() => {
          setVisible(false);
          onClose && onClose();
        }, 300); // Match animation duration
      }, 2500); // Show for 2.5 seconds before starting exit animation

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!visible) return null;

  return (
    <div 
      className={`fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
        isExiting ? 'animate-fade-out' : 'animate-slide-in'
      }`}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
      <span className="font-medium">Đăng xuất thành công!</span>
      <button 
        onClick={() => {
          setIsExiting(true);
          setTimeout(() => {
            setVisible(false);
            onClose && onClose();
          }, 300);
        }}
        className="ml-2 text-white hover:text-gray-200 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default LogoutSuccess;
