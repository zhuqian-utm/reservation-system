import { Navigate } from 'react-router-dom';
import { UserRole } from '@reservation-system/data-access';
import { JSX } from 'react';

export const ProtectedRoute = ({ 
  children, 
  requiredRole 
}: { 
  children: JSX.Element, 
  requiredRole: UserRole 
}) => {
  // In a real app, use a Context Provider, but localStorage works for this MVP
  const user = JSON.parse(localStorage.getItem('user_user') || '{}');
  const token = localStorage.getItem('user_token');

  if (!token || user.role !== requiredRole) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
