import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './style/header.css'; // Импортируем стили
import logo from './img/logoimage.png';
import Modal from '../Modal/Modal.jsx';
import LoginForm from '../Form/UserForm/LoginForm.jsx';
import SignUpForm from '../Form/UserForm/SignUpForm.jsx';
import { useAuth } from '../../AuthContext/AuthContext.js';
import axios from 'axios'

const Header = ({showLogin, setShowLogin, modalOpen, setModalOpen}) => {


  const { isAuthenticated, logout, login, user, userId } = useAuth();

  const handleLogin = async (email, password, setError) => {
    const dataUser = {
      email: email,
      password: password
    }

    const loginResult = await axios.post('http://localhost:3001/api/users/login', dataUser);

    if (loginResult.data.success) {
      login(loginResult.data.email, loginResult.data.userid,loginResult.data.username)
      setModalOpen(false);
      setError('')
    } else {
      setError(loginResult.data.message)
    }

  };


  const handleSignUp = async (username,email,password,setError) => {

    const userData = {
      username:username,
      email:email,
      passwordhash:password
    }
    const resultCreateNewUser = await axios.post('http://localhost:3001/api/users',userData)
    console.log(resultCreateNewUser.data)

    if(!resultCreateNewUser.data.success){
      
      setError(resultCreateNewUser.data.message)
      setShowLogin(showLogin);
      
    }else{
      setShowLogin(!showLogin)
    }
    
  };

  const switchForm = () => {
    setShowLogin(!showLogin);
  };

  const closeModal = () => {
    setModalOpen(false);
    // Возвращаем состояние к исходному, чтобы отображалась форма входа в следующий раз
    setShowLogin(true);
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <img src={logo} alt="logo" className='logo-image' />
          <NavLink to="/" className="nav-link">PipeNetCalc</NavLink>
        </div>

        <nav className="navigation">
          <NavLink to="/docs" className="nav-link">Документация</NavLink>
        </nav>
        {!isAuthenticated ? (
        <div className="right-section">
          <button onClick={() => { setModalOpen(true); setShowLogin(true) }} className="nav-button">Войти</button>
          <button onClick={() => { setModalOpen(true); setShowLogin(false) }} className="nav-button nav-button--signup">Зарегистрироваться</button>
        </div>
        ) : (
          <div className="right-section">
              <NavLink to="/dashboard/private-office" className="nav-button">Личный кабинет</NavLink>
          </div>
        )}
      <Modal isOpen={modalOpen} onClose={closeModal}>
        {showLogin ? (
          <LoginForm onLogin={handleLogin} onSwitch={switchForm} />
        ) : (
          <SignUpForm onSignUp={handleSignUp} onSwitch={switchForm} />
        )}
      </Modal>
    </div>
    </header >
  );
};

export default Header;