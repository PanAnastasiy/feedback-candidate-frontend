
import React from 'react'
import './Preview.css';
import {useNavigation} from "../../utils/useNavigation";

export default function Preview() {
    const { navigateTo } = useNavigation();

    return (
        <div className="welcome-container">
            <div className="welcome-content">
                <h1>Добро пожаловать!</h1>
                <p>Мы рады видеть вас на нашем сайте. Начните своё путешествие прямо сейчас.</p>
                <button className="cta-button" onClick={() => navigateTo('/registration')}>
                    Начать
                </button>
            </div>
        </div>
    );
}