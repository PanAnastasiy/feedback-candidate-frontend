import { getAuthHeaders} from "../utils/getAuthHeaders";
import { Skill } from "../types/Skill";
import {getApiEndpoint} from "../configs/app";

// Получить все навыки
export const getAllSkills = async (): Promise<Skill[]> => {
  const response = await fetch(getApiEndpoint("/skills"), {
    method: "GET",
    headers: getAuthHeaders(),
  });

  console.log("API URL:", getApiEndpoint("/skills"));
  console.log("Response status:", response.status);
  console.log("Response headers:", response.headers);

  if (!response.ok) {
    throw new Error(`Ошибка при получении навыков: ${response.status}`);
  }

  return response.json();
};

// Создать новый навык
export const createSkill = async (skill: Omit<Skill, 'id'>): Promise<Skill> => {
  const response = await fetch(getApiEndpoint("/skills"), {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(skill),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    if (response.status === 409) {
      throw new Error(errorData.message || 'Такой навык уже существует.');
    } else {
      throw new Error(`Ошибка ${response.status}: ${errorData.message || 'Неизвестная ошибка'}`);
    }
  }

  return response.json();
};

// Обновить навык по ID
export const updateSkill = async (id: number, skill: Omit<Skill, 'id'>): Promise<Skill> => {
  const response = await fetch(getApiEndpoint(`/skills/${id}`), {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(skill),
  });

  if (!response.ok) {
    throw new Error('Ошибка при обновлении навыка');
  }

  return response.json();
};

// Удалить навык по ID
export const deleteSkill = async (id: number): Promise<boolean> => {
  const response = await fetch(getApiEndpoint(`/skills/${id}`), {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Ошибка при удалении навыка');
  }

  return true;
};
