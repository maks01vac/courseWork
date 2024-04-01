import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './style/header.css'; // Импортируем стили
import logo from './img/logoimage.png';
import Modal from '../Modal/Modal.jsx';
import LoginForm from '../UserForm/LoginForm.jsx';
import SignUpForm from '../UserForm/SignUpForm.jsx';
import { useAuth } from '../../AuthContext/AuthContext.js';
import axios from 'axios'

const Header = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const { isAuthenticated, logout } = useAuth();

  const auth = useAuth();

  const handleLogin = async (email, password, setError) => {
    const dataUser = {
      email: email,
      password: password
    }

    const loginResult = await axios.post('http://localhost:3001/api/users/login', dataUser);

    if (loginResult.data.success) {
      auth.login(loginResult.email, loginResult.userid)
      setModalOpen(false);
      setError('')
    } else {
      console.log(loginResult)
      setError(loginResult.data.message)
    }

  };

  const handleSignUp = async (username,email,password,setError) => {

    const userData = {
      username:username,
      email:email,
      passwordhash:password
    }
    console.log(userData)
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
          <NavLink to="/help" className="nav-link">Помощь</NavLink>
          <NavLink to="/about-us" className="nav-link">О нас</NavLink>
        </nav>
        {!isAuthenticated ? (
        <div className="right-section">
          <button onClick={() => { setModalOpen(true); setShowLogin(true) }} className="nav-button">Войти</button>
          <button onClick={() => { setModalOpen(true); setShowLogin(false) }} className="nav-button nav-button--signup">Зарегистрироваться</button>
        </div>
        ) : (
          <div className="right-section">
            <button className="nav-button" onClick={logout}>Выйти</button>
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