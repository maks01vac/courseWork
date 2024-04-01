
import './App.css';
import Header from './components/Header/Header';
import Main from './components/Main/Main';
import Footer from './components/Footer/Footer';
import AboutUs from './components/AboutUs/AboutUs';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './AuthContext/AuthContext';
// Импортируйте остальные компоненты

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header/>
          <Routes>
            <Route exact path="/" element={<Main/>} />
            <Route exact path="/about-us" element={<AboutUs/>} />
            {/* <PrivateRoute path="/dashboard" component={Dashboard} /> */}
            {/* Другие маршруты */}
          </Routes>
          {/* <Footer/> */}
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;