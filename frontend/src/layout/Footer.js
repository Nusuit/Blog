import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/layout/Footer.css';

const Footer = () => {
  const footerLinks = {
    about: [
      { label: 'Giới thiệu', path: '/about' },
      { label: 'Điều khoản', path: '/terms' },
      { label: 'Quyền riêng tư', path: '/privacy' },
    ],
    support: [
      { label: 'Trợ giúp', path: '/help' },
      { label: 'Liên hệ', path: '/contact' },
      { label: 'Báo lỗi', path: '/report' },
    ],
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-branding">
          <h2>BlogWeb</h2>
          <p>Nơi chia sẻ những câu chuyện của bạn</p>
        </div>

        <div className="footer-links">
          <div className="link-section">
            <h3>Về chúng tôi</h3>
            <ul>
              {footerLinks.about.map((link, index) => (
                <li key={index}>
                  <Link to={link.path}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="link-section">
            <h3>Hỗ trợ</h3>
            <ul>
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <Link to={link.path}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 BlogWeb _ CNPM. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;