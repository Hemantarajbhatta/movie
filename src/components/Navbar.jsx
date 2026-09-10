import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Bell, User, Play, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  // Optional: add scroll listener to change navbar background when scrolling down
  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`main-navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <div className="nav-left">
          <Link to="/" className="nav-brand">
            M<span className="logo-play"><Play size={18} fill="currentColor" /></span>ov
          </Link>
          <div className="nav-links">
            <Link to="/" className="active">Home</Link>
            <Link to="/movies">Movies</Link>
            <Link to="/series">Series</Link>
            <Link to="/kids">Kids</Link>
          </div>
        </div>

        <div className="nav-right">
          <button className="icon-btn"><Search size={20} /></button>
          <button className="icon-btn"><Bell size={20} /></button>
          
          {user ? (
            <div className="user-profile-menu">
              {user.role === 'admin' && (
                <Link to="/admin" className="admin-link" style={{ marginRight: '1rem', color: '#3b82f6', fontWeight: 'bold' }}>
                  Admin Panel
                </Link>
              )}
              <Link to="/bookings" style={{ marginRight: '1rem' }}>Bookings</Link>
              <button onClick={logout} style={{ marginRight: '1rem', color: '#ef4444' }}>Logout</button>
              <div className="avatar placeholder"><User size={16} /></div>
            </div>
          ) : (
            <Link to="/login" className="login-link">Login</Link>
          )}
          
          <button className="mobile-menu-btn icon-btn" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-nav-links">
          <Link to="/" onClick={closeMobileMenu}>Home</Link>
          <Link to="/movies" onClick={closeMobileMenu}>Movies</Link>
          <Link to="/series" onClick={closeMobileMenu}>Series</Link>
          <Link to="/kids" onClick={closeMobileMenu}>Kids</Link>
          {user && <Link to="/bookings" onClick={closeMobileMenu}>My Bookings</Link>}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
