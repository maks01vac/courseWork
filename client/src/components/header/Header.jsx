import React from 'react';
import './style/header.css'; // Импортируем стили
import logo from './img/logoimage.png';

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <img src={logo} className='logo-image' />
          <a href="" className="nav-link">PipeNetCalc</a>
        </div>

        <nav className="navigation">
          <a href="/help" className="nav-link">Помощь</a>
          <a href="/about" className="nav-link">О нас</a>
        </nav>
        <div className="right-section">
          <button className="nav-button">Войти</button>
          <button className="nav-button nav-button--signup">Зарегистрироваться</button>
        </div>
      </div>
    </header>
  );
};

export default Header;