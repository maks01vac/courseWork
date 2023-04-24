import React from 'react'
import logo from './img/logo.png'
import './style/header.css'

export default function Header() {
  return (
    <header>
        <div >
          <img className="logo" src={logo}/>
        </div>
    </header>
  )
}
