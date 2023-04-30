import React from 'react';
import './styles/Fotter.css';
import logo from './img/logo.png'

const Fotter = () => {
    return (
        <footer>
            <div className="fotter">
                <div className="logo"><img className="logo" src={logo} /></div>
                <div className="links">
                    <a href="#about">О проекте</a>
                    <a href="#help">Помощь</a>
                    <a href="#contact">Контакты</a>
                </div>
                <div className="copyright">
                    &copy; {new Date().getFullYear()} PipeCalcNetwork. Все права защищены.
                </div>
            </div>
        </footer>
    );
};

export default Fotter;