import React from 'react';
import './styles/Footer.css';
import logo from './img/logo.png';

const Footer = () => {
    return (
        <footer className="footer-container">
            <div className="footer-content">
                <div className="footer-logo">
                    <img src={logo} alt="PipeNetCalc logo" />
                    <div className="footer-title">PipeNetCalc</div>
                </div>
                
                <div className="footer-contacts">
                    <ul>
                        <li>Email: maks01vac@gmail.com</li>
                        <li>Telegram: @gglazgo</li>
                        <li>Instagram: @gglazgo</li>
                    </ul>
                </div>
                <div className="footer-copyright">
                    PipeNetCalc &copy; {new Date().getFullYear()}: All rights reserved
                </div>
            </div>
        </footer>
    );
};

export default Footer;