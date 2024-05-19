import React, {useState, useEffect} from 'react';
import './style/PrivateOffice.css'
import { useAuth } from '../../../AuthContext/AuthContext';
import axios from 'axios';

const PrivateOffice = () => {
    const {username, user, userId} = useAuth()

    const [pipelinesCount, setPipelinesCount] = useState(0); // Добавляем состояние

    // Асинхронная функция для подсчета количества сетей
    const countPipelinesByUser = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:3001/api/user/${userId}/pipelines`);
            return response.data.length; // Предполагаем, что длина массива — это количество сетей
        } catch (err) {
            return 0; // В случае ошибки возвращаем 0
        }
    };

    // Хук для вызова функции при загрузке компонента
    useEffect(() => {
        const fetchPipelinesCount = async () => {
            const count = await countPipelinesByUser(userId);
            setPipelinesCount(count); // Обновляем состояние после получения данных
        };

        fetchPipelinesCount(); // Запускаем асинхронную функцию
    }, [userId]); // Запуск при изменении userId


    return (
        <div className="private-office-content">
            <h2>Мой кабинет</h2>
            <ul>
                <li>Никнейм: <b>{username}</b></li>
                <li>Электронная почта: <b>{user}</b></li>
                <li>Количество сохраненных сетей: <b>{pipelinesCount}</b></li>
            </ul>
            <button className="delete-account-button">Удалить аккаунт</button>
        </div>
    );
};

export default PrivateOffice;