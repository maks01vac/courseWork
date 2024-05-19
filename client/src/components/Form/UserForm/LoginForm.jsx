import React, {useState} from 'react';
import './style/LoginForm.css'; // Предполагается, что стили находятся в LoginForm.css

const LoginForm = ({ onLogin, onSwitch }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // Добавлено состояние для ошибки



    const handleSubmit = (event) => {
        event.preventDefault();
        // Вызовите onLogin для обработки логина пользователя
        onLogin(email, password,setError);
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit} className="form-inner">
                <h1 className="form-title">Вход</h1>
                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    className="form-input"
                    placeholder="Email" required
                />
                <input
                    type="password"
                    className="form-input"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" className="form-button">Войти</button>
                {error && <div className="error">{error}</div>} {/* Показать ошибку если она есть */}
                <div className="form-action">
                    <a href="#" onClick={onSwitch}>Нет аккаунта? Зарегистрироваться</a>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;