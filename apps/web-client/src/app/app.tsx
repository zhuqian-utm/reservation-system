import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { UserRole } from '@reservation-system/data-access';
import { authService } from './services/auth.service';

import '../styles.css';

// Components
import { ReservationForm } from './components/ReservationForm';
import { EmployeeDashboard } from './components/EmployeeDashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginModal } from './components/LoginModal';
import { Navbar } from './components/Navbar';
import { Register } from './components/Register';
import { GuestDashboard } from './components/GuestDashboard';
import HiltonWelcomePage from './components/Welcome';

export default function App() {
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [user, setUser] = useState(authService.getCurrentUser());

  // Listen for changes or initial load
  useEffect(() => {
    setUser(authService.getCurrentUser());
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* --- NAVIGATION BAR --- */}
      <Navbar />

      {/* --- MODAL --- */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setLoginOpen(false)} />

      {/* --- PAGE CONTENT --- */}
      <main className="container mx-auto py-12 px-4">
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<HiltonWelcomePage />} />

          {/* Protected Guest Route */}
          <Route
            path="/reservation"
            element={
              <ProtectedRoute requiredRole={UserRole.GUEST}>
                <ReservationForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/guestbooking"
            element={
              <ProtectedRoute requiredRole={UserRole.GUEST}>
                <GuestDashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected Employee Route */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requiredRole={UserRole.EMPLOYEE}>
                <EmployeeDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/register" element={<Register />} />

          {/* Fallback */}
          <Route
            path="*"
            element={<Link to="/">Page not found. Return Home</Link>}
          />
        </Routes>
      </main>
    </div>
  );
}
