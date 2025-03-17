// frontend/src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ user, setUser }) => {
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <nav className="navbar">
      <Link to="/">Home</Link>
      <Link to="/benefits">Benefits of Gita</Link>
      {user ? (
        <>
          {user.role === 'admin' ? (
            <Link to="/admin">Admin Dashboard</Link>
          ) : (
            <span>Welcome, {user.name}</span>
          )}
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/register">Become a Seeker</Link>
          <Link to="/login">Worship Lord Krishna</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
