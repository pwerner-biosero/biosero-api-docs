// src/components/AuthNavbarItems.jsx
import React from 'react';
import { useAuth } from '@site/src/auth/AuthProvider';
import useBaseUrl from '@docusaurus/useBaseUrl';

export default function AuthNavbarItems() {
  const { isAuthenticated, logout } = useAuth();
  const loginUrl = useBaseUrl('/login');

  const handleLogout = () => {
    try {
      logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (isAuthenticated) {
    return (
      <button
        className="navbar__item navbar__link"
        onClick={handleLogout}
        style={{
          background: 'none',
          border: 'none',
          color: 'inherit',
          cursor: 'pointer',
          fontSize: 'inherit',
          padding: '0.25rem 0.5rem',
          textDecoration: 'none',
        }}
      >
        Logout
      </button>
    );
  }

  return (
    <a
      className="navbar__item navbar__link"
      href={loginUrl}
    >
      Login
    </a>
  );
}