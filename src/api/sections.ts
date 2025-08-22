import { getAuthHeaders } from "../utils/getAuthHeaders";
import { Section } from "../types/Section";

// Получить все секции
export const getAllSections = async (): Promise<Section[]> => {
    const response = await fetch("http://localhost:8000/sections", {
        method: "GET",
        mode: "cors",
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        throw new Error(`Ошибка при получении списка секций: ${response.status}`);
    }

    return response.json();
};

// Создать новую секцию
export const createSection = async (section: Omit<Section, 'id'>): Promise<Section> => {
    try {
        const response = await fetch("http://localhost:8000/sections", {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(section),
        });

        if (!response.ok) {
            const errorData = await response.json();
            if (response.status === 409) {
                throw new Error(errorData.message || "Такая секция уже существует.");
            } else {
                throw new Error(`Ошибка ${response.status}: ${errorData.message || "Неизвестная ошибка"}`);
            }
        }

        return response.json();
    } catch (error) {
        console.error("Ошибка при создании секции:", error);
        throw error;
    }
};

// Обновить секцию по ID
export const updateSection = async (id: number, section: Omit<Section, 'id'>): Promise<Section> => {
    try {
        const response = await fetch(`http://localhost:8000/sections/${id}`, {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify(section),
        });

        if (!response.ok) {
            throw new Error("Ошибка при обновлении секции");
        }

        return response.json();
    } catch (error) {
        console.error("Ошибка при обновлении секции:", error);
        throw error;
    }
};

// Удалить секцию по ID
export const deleteSection = async (id: number): Promise<boolean> => {
    try {
        const response = await fetch(`http://localhost:8000/sections/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error("Ошибка при удалении секции");
        }

        return true;
    } catch (error) {
        console.error("Ошибка при удалении секции:", error);
        throw error;
    }
};
