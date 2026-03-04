import { UserRole } from '@reservation-system/data-access';

export const authService = {
  async login(email: string, password: string) {
    const baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

    const response = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    // Centralized Storage Logic
    localStorage.setItem('hilton_token', data.access_token);
    localStorage.setItem('hilton_user', JSON.stringify(data.user));

    return data.user;
  },

  logout() {
    localStorage.removeItem('hilton_token');
    localStorage.removeItem('hilton_user');
    window.location.href = '/';
  },

  getCurrentUser() {
    const user = localStorage.getItem('hilton_user');
    return user ? JSON.parse(user) : null;
  },
};
