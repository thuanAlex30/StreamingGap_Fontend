import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import '../css/Header.css'; // File CSS cho footer

const Footer = () => {
  return (
    <footer className='footer'>
      <div className='footer-content'>
        <div className='footer-section about'>
          <h3>StreamingGAP</h3>
          <p>Nơi bạn khám phá âm nhạc và thưởng thức các bản nhạc yêu thích mọi lúc mọi nơi.</p>
        </div>
        <div className='footer-section links'>
          <h4>Links</h4>
          <ul>
            <li><a href='/about'>Giới thiệu</a></li>
            <li><a href='/terms'>Điều khoản sử dụng</a></li>
            <li><a href='/privacy'>Chính sách bảo mật</a></li>
            <li><a href='/help'>Trợ giúp</a></li>
          </ul>
        </div>
        <div className='footer-section social'>
          <h4>Theo dõi chúng tôi</h4>
          <div className='social-icons'>
            <a href='https://facebook.com'><FaFacebook size={30} /></a>
            <a href='https://twitter.com'><FaTwitter size={30} /></a>
            <a href='https://instagram.com'><FaInstagram size={30} /></a>
            <a href='https://youtube.com'><FaYoutube size={30} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
