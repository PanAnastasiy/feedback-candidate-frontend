import { Article } from "../types/Article";
import { getAuthHeaders} from "../utils/getAuthHeaders";
import {getApiEndpoint} from "../configs/app";

export const fetchArticles = async (): Promise<Article[]> => {
  try {
    const response = await fetch(getApiEndpoint('/habr/articles'), {
      method: 'GET',
      headers: getAuthHeaders(),
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
