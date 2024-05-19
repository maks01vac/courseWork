import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import './style/DocumentationSidebar.css'; // Подключите свой файл со стилями

const DocumentationSidebar = () => {
    const [expanded, setExpanded] = useState({}); // Для управления развернутыми секциями
    const navigate = useNavigate();

    // Объект с секциями и подпунктами документации
    const sections = [
        {
            name: 'Введение',
            subItems: [
                { name: 'Обзор функционала', path: "introduction/overview" },
                { name: 'Цели и преимущества', path: 'introduction/goals-benefits' }
            ]
        },
        {
            name: 'Главная страница',
            subItems: [
                { name: 'Быстрая регистрация и вход', path: 'main/login' },
                { name: 'Кнопка для перехода в личный кабинет.', path: 'main/button-my-cabinet' },
                { name: 'Кнопка "Создать сеть"', path: 'main/button-my-cabinet' }
            ]
        },
        {
            name: 'Личный кабинет',
            subItems: [
                { name: 'Просмотр базовой информации о профиле.', path: 'profile/account-info' },
                { name: 'Удаление профиля', path: 'profile/delete-account' },
                { name: '"Мои сети"', path: 'profile/my-pipelines' }
            ]
        },
        {
            name: 'Создание сети',
            subItems: [
                { name: 'Описание страницы создания сети', path: 'network-creation/description' },
                { name: 'Графическое построение', path: 'network-creation/graphical-construction' },
                { name: 'Графическая валидация', path: 'network-creation/validation-errors' }
            ]
        },
        {
            name: 'Ввод данных трубопроводной сети:',
            subItems: [
                { name: 'Форма для ввода данных', path: 'network-data/form' },
                { name: 'Валидация данных', path: 'network-data/validation' }
            ]
        },
        {
            name: 'Окно результатов',
            subItems: [
                { name: 'Описание окна результатов', path: 'results-window/description' },
                { name: 'Возможности', path: 'results-window/features' }
            ]
        },
        {
            name: 'Мои сети',
            subItems: [
                { name: 'Удаление сети', path: 'my-networks/description' },
                { name: 'Возвращение к расчетам', path: 'my-networks/features' },
                { name: 'Создание отчета', path: 'my-networks/features' },
            ]
        }
    ];

    // Функция переключения отображения подпунктов
    const toggleExpand = (section) => {
        setExpanded((prev) => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    return (
        <div className="documentation-sidebar">
            <h2>Документация</h2>
            {sections.map((section, index) => (
                <div key={index} className="sidebar-section">
                    <div className="section-header" onClick={() => toggleExpand(section.name)}>
                        <span>{section.name}</span>
                        <span className={`arrow ${expanded[section.name] ? 'expanded' : ''}`}>▼</span>
                    </div>
                    {expanded[section.name] && (
                        <ul className="section-links">
                            {section.subItems.map((item, subIndex) => (
                                <li key={subIndex} >
                                    <NavLink to={item.path}>{item.name}</NavLink> 
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            ))}
        </div>
    );
};

export default DocumentationSidebar;