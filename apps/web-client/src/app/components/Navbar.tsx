import { Fragment, useState } from 'react';
import { authService } from '../services/auth.service';
import { LoginModal } from './LoginModal';
import { Link } from 'react-router-dom';
import { UserRole } from '@reservation-system/data-access';

export const Navbar = () => {
  const [isLoginOpen, setLoginOpen] = useState(false);
  const user = authService.getCurrentUser();

  return (
    <nav className="nav-container">
      {/* Branding - Optional but recommended for luxury feel */}
      <div className="nav-logo">RESERVATION</div>

      <div className="nav-links">
        {user?.role === UserRole.EMPLOYEE ? (
          <Link to="/dashboard" className="nav-item nav-item-staff">
            Staff Portal
          </Link>
        ) : user?.role === UserRole.GUEST ? (
          <Fragment>
            <Link to="/reservation" className="nav-item">
              Book a Table
            </Link>
            <Link to="/guestbooking" className="nav-item">
              My Booking
            </Link>
          </Fragment>
        ) : null}
      </div>

      <div className="nav-auth">
        {user ? (
          <div className="user-profile">
            <span className="user-email">
              Welcome, <strong>{user.username}</strong>
            </span>
            <button className="btn-logout" onClick={() => authService.logout()}>
              Logout
            </button>
          </div>
        ) : (
          <button className="btn-signin" onClick={() => setLoginOpen(true)}>
            Sign In
          </button>
        )}
      </div>

      <LoginModal isOpen={isLoginOpen} onClose={() => setLoginOpen(false)} />
    </nav>
  );
};
