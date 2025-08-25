import { getAuthHeaders} from "../utils/getAuthHeaders";
import { Section } from "../types/Section";
import {getApiEndpoint} from "../configs/app";

// Получить все секции
export const getAllSections = async (): Promise<Section[]> => {
  const response = await fetch(getApiEndpoint("/sections"), {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Ошибка при получении списка секций: ${response.status}`);
  }

  return response.json();
};

// Создать новую секцию
export const createSection = async (section: Omit<Section, 'id'>): Promise<Section> => {
  const response = await fetch(getApiEndpoint("/sections"), {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(section),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    if (response.status === 409) {
      throw new Error(errorData.message || "Такая секция уже существует.");
    } else {
      throw new Error(`Ошибка ${response.status}: ${errorData.message || "Неизвестная ошибка"}`);
    }
  }

  return response.json();
};

// Обновить секцию по ID
export const updateSection = async (id: number, section: Omit<Section, 'id'>): Promise<Section> => {
  const response = await fetch(getApiEndpoint(`/sections/${id}`), {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(section),
  });

  if (!response.ok) {
    throw new Error("Ошибка при обновлении секции");
  }

  return response.json();
};

// Удалить секцию по ID
export const deleteSection = async (id: number): Promise<boolean> => {
  const response = await fetch(getApiEndpoint(`/sections/${id}`), {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Ошибка при удалении секции");
  }

  return true;
};
