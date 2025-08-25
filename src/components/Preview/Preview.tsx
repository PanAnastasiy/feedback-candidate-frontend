import React from 'react';
import './Preview.css';
import { useNavigate } from 'react-router-dom';

export default function Preview() {
    const navigate = useNavigate();

    const handleStart = () => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/candidates"); // если токен есть → на кандидатов
        } else {
            navigate("/auth"); // если нет → на форму авторизации
        }
    };

    return (
        <div className="welcome-container">
            <div className="welcome-content">
                <h1>Добро пожаловать!</h1>
                <p>Мы рады видеть вас на нашем сайте. Начните своё путешествие прямо сейчас.</p>
                <button className="cta-button" onClick={handleStart}>
                    Начать
                </button>
            </div>
        </div>
    );
}


