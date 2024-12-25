import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-links">
        <Link to="/about-us">About Us</Link>
        <Link to="/privacy-policy">Privacy Policy</Link>
        <Link to="/shipping-policy">Shipping Policy</Link>
      </div>
      <div className="copyright">
        <p>Copyright © 2024 BookYourBook. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
