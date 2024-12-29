import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Auth pages
import Login from "./pages/auth/Login.jsx";
import Register from './pages/auth/Register.jsx';
import Home from './pages/Home.jsx';
import NotFound from './pages/NotFound.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
//other imports
import LandingPage from './pages/LandingPage.jsx';
import PaymentPage from './components/payment/PaymentPage.jsx';
import SuccessPage from './components/payment/SuccessPage.jsx';
import { ForgotPassword, ResetPassword } from './components/auth/ForgotPassword.jsx';
import Privacy from './components/legal/privacy.jsx';
import Terms from './components/legal/terms.jsx';

// Logout functionality
function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}

// Register with logout
function RegisterAndLogout() {
  localStorage.clear();
  return <Register />;
}

const AppRoutes = () => {
  return (
    <Routes>
      {/* Landing page as the initial route */}
      <Route path="/" element={<LandingPage />} />

      {/* Protected dashboard route */}
      <Route
        path='/dashboard'
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      {/* Auth routes */}
      <Route path='/login' element={<Login />} />
      <Route path='/logout' element={<Logout />} />
      <Route path='/register' element={<RegisterAndLogout />} />
      
      {/* 404 route */}
      <Route path='*' element={<NotFound />} />

        {/* Add these new routes inside ProtectedRoute since payments require auth */}
        <Route
        path='/payment'
        element={
          <ProtectedRoute>
            <PaymentPage />
          </ProtectedRoute>
        }
      />
      <Route
        path='/success'
        element={
          <ProtectedRoute>
            <SuccessPage />
          </ProtectedRoute>
        }
      />

      <Route path='/forgot-password' element={<ForgotPassword />} />
      <Route path='/reset-password' element={<ResetPassword />} />

      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
    </Routes>
  );
};

export default AppRoutes;
