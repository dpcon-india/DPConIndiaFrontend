import React from 'react';
import { FaWhatsapp, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

function FloatingIcons() {
  return (
    <ul
      style={{
        position: 'fixed',
        right: '20px',
        zIndex: 1000,
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        listStyle: 'none',
        padding: '0',
        margin: '0',
      }}
    >
      <li style={iconStyle}>
        <a
          href="https://wa.me/9833133366"
          target="_blank"
          rel="noopener noreferrer"
          style={{ ...linkStyle, backgroundColor: '#25D366' }}
        >
          <FaWhatsapp size={22} />
        </a>
      </li>
      <li style={iconStyle}>
        <a
          href="tel:9833133366"
          style={{ ...linkStyle, backgroundColor: '#011339' }}
        >
          <FaPhoneAlt size={22} />
        </a>
      </li>
      <li style={iconStyle}>
        <a
          href="mailto:dpconindia@gmail.com"
          style={{ ...linkStyle, backgroundColor: '#FF6347' }}
        >
          <FaEnvelope size={22} />
        </a>
      </li>
    </ul>
  );
}

const iconStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const linkStyle = {
  width: '50px',
  height: '50px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '50%',
  color: '#fff',
  textDecoration: 'none',
  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
  transition: 'transform 0.2s, box-shadow 0.2s',
};

export default FloatingIcons;
