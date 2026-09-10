import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, MessageCircle, Camera, Video, Mail, Phone, MapPin } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-col brand-col">
            <h2>CINEMATIX</h2>
            <p>Your premium destination for the ultimate movie experience. Book tickets, choose your favorite seats, and enjoy the show.</p>
            <div className="social-links">
              <a href="#"><Globe size={20} /></a>
              <a href="#"><MessageCircle size={20} /></a>
              <a href="#"><Camera size={20} /></a>
              <a href="#"><Video size={20} /></a>
            </div>
          </div>
          
          <div className="footer-col">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/movies">Now Showing</Link></li>
              <li><Link to="/cinemas">Our Cinemas</Link></li>
              <li><Link to="/offers">Offers & Promotions</Link></li>
              <li><Link to="/gift-cards">Gift Cards</Link></li>
            </ul>
          </div>
          
          <div className="footer-col">
            <h3>Help & Support</h3>
            <ul>
              <li><Link to="/faq">FAQs</Link></li>
              <li><Link to="/terms">Terms & Conditions</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/cancellation">Cancellation Policy</Link></li>
            </ul>
          </div>
          
          <div className="footer-col">
            <h3>Contact Us</h3>
            <ul className="contact-info">
              <li><MapPin size={16} /> <span>123 Cinema Street, Kathmandu</span></li>
              <li><Phone size={16} /> <span>+977 1-4000000</span></li>
              <li><Mail size={16} /> <span>support@cinematix.com</span></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Cinematix. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
