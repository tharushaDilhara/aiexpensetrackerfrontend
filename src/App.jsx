/* import React, { useEffect, useState } from 'react'
import AuthModal from './components/AuthModal'
import MainContent from './MainContent'
import LoginModal from './components/LoginModal'
import RegisterModal from './components/RegisterModal'
import { BrowserRouter, Routes, Route, Link, Outlet, Router, Navigate, useNavigate } from 'react-router-dom';

const App = () => {

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(true);
  const [isUserLogged, setIsUserLogged] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  //const navigate = useNavigate()
  //const[user,setUser]=useState(null)


  const checkIsUserIsLogged=()=>{
    const user = localStorage.getItem("user")
    const validtoken = localStorage.getItem("token")

    if (!user) {
      setIsUserLogged(false)
    }

    if (user && validtoken) {
      setIsUserLogged(true)
      console.log(user,validtoken);
      
    }

  }
  useEffect(()=>{
    checkIsUserIsLogged()
  })
  
  
  return (
    
      <BrowserRouter>
        <Routes>
          <Route path='/'   element={<Navigate to="/login" replace />} />
          <Route path='/login'   element={<LoginModal />} />
          <Route path='/register' element={<RegisterModal />}/>
          {isUserLogged ? <Route path='/expenzaai' element={<MainContent />} />
            :
          <Route path='/login' element={<LoginModal />} />
          }
          
        </Routes>
      </BrowserRouter>
  
  )
}

export default App */

import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

import MainContent from './MainContent';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';

// Protected Route Component
const ProtectedRoute = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; // in seconds

    if (decoded.exp < currentTime) {
      // Token expired → auto logout
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return <Navigate to="/login" replace />;
    }

    // Token valid → allow access
    return <Outlet />;
  } catch (error) {
    // Invalid token
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return <Navigate to="/login" replace />;
  }
};

// Public Route (prevent access if already logged in)
const PublicRoute = () => {
  const token = localStorage.getItem('token');

  if (token) {
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp >= Date.now() / 1000) {
        return <Navigate to="/expenzaai" replace />;
      }
    } catch {} 
    // If error or expired, just let them see login (cleanup happens in ProtectedRoute)
  }

  return <Outlet />;
};

const App = () => {
  const [isUserLogged, setIsUserLogged] = useState(false);

  // Check authentication status on mount and when storage changes
  const checkAuthStatus = () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setIsUserLogged(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const isValid = decoded.exp >= Date.now() / 1000;

      setIsUserLogged(isValid);

      if (!isValid) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } catch (error) {
      setIsUserLogged(false);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  useEffect(() => {
    checkAuthStatus();

    // Optional: Listen for storage changes (e.g., login from another tab)
    window.addEventListener('storage', checkAuthStatus);

    // Optional: Poll every minute to catch near-expiry
    const interval = setInterval(checkAuthStatus, 60000);

    return () => {
      window.removeEventListener('storage', checkAuthStatus);
      clearInterval(interval);
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public routes - Login & Register */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginModal />} />
          <Route path="/register" element={<RegisterModal />} />
        </Route>

        {/* Protected route - Main App */}
        <Route element={<ProtectedRoute />}>
          <Route path="/expenzaai" element={<MainContent />} />
        </Route>

        {/* Catch-all: redirect to appropriate place */}
        <Route path="*" element={<Navigate to={isUserLogged ? "/expenzaai" : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;