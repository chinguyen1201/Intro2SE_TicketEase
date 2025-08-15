// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  
import Home from './pages/Home';  // Trang Home
import Login from './pages/Login'; // Trang login
import Signup from './pages/Signup'; // Trang đăng ký

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />  
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
