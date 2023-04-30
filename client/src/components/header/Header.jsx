import React from 'react'
import logo from './img/logo.png'
import './style/header.css'

export default function Header() {
  return (
    <header>
      <div className='header'>
      <a href="/" className="logo">
          <img src={logo} alt="logo" />
        </a>
        <nav className="navbar">
          <a href="#about">О проекте</a>
          <a href="#help">Помощь</a>
          <a href="#contact">Контакты</a>
        </nav>
      </div>

    </header>
  )
}
