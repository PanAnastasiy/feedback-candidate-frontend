import { Article } from "../types/Article";
import {getAuthHeaders} from "../utils/getAuthHeaders";


export const fetchArticles = async (): Promise<Article[]> => {
    try {

        const response = await fetch('http://127.0.0.1:8000/habr/articles', {
            method: 'GET',

        });

        if (!response.ok) {
            throw new Error('Ошибка при загрузке данных');
        }

        const data: Article[] = await response.json();
        return data;
    } catch (error) {
        console.error('Ошибка:', error);
        throw error;
    }
};
