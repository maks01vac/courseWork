import React, {useState} from 'react';
import './style/LoginForm.css'; // Предполагается, что стили находятся в LoginForm.css

const SignUpForm = ({ onSignUp, onSwitch }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // Добавлено состояние для ошибки

    const handleSubmit = (event) => {
        event.preventDefault();
        // Вызовите onLogin для обработки логина пользователя
        onSignUp(username,email,password,setError);
    };



    return (
        <div className="form-container">
            <form onSubmit={handleSubmit} className="form-inner">
                <h1 className="form-title">Регистрация</h1>

                <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    type="text"
                    className="form-input"
                    placeholder="Username" required
                />

                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    className="form-input"
                    placeholder="Email" required />

                <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    className="form-input"
                    placeholder="Password"
                    required
                />

                <button type="submit"  className="form-button">Создать аккаунт</button>
                {error && <div className="error">{error}</div>} {/* Показать ошибку если она есть */}
                <div className="form-action">
                    <a href="#" onClick={onSwitch}>Войти в аккаунт</a>
                </div>
            </form>
        </div>
    );
};

export default SignUpForm;