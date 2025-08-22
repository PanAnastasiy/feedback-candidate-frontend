import { getAuthHeaders } from '../utils/getAuthHeaders';
import { CandidateStatus } from '../types/CandidateStatus';

// Получить все статусы
export const getCandidateStatuses = async (): Promise<CandidateStatus[]> => {
  const response = await fetch("http://localhost:8000/statuses", {
    method: "GET",
    mode: "cors",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    console.error(`Ошибка загрузки статусов: ${response.status}`);
    throw new Error("Не удалось загрузить статусы кандидатов");
  }

  return response.json();
};

// Создать новый статус
export const createCandidateStatus = async (status: Omit<CandidateStatus, 'id'>): Promise<CandidateStatus> => {
  try {
    const response = await fetch("http://localhost:8000/statuses", {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(status),
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 409) {
        throw new Error(errorData.message || "Такой статус уже существует.");
      } else {
        throw new Error(`Ошибка ${response.status}: ${errorData.message || "Неизвестная ошибка"}`);
      }
    }

    return response.json();
  } catch (error) {
    console.error("Ошибка при создании статуса:", error);
    throw error;
  }
};

// Обновить статус по ID
export const updateCandidateStatus = async (
  id: number,
  status: Omit<CandidateStatus, 'id'>
): Promise<CandidateStatus> => {
  try {
    const response = await fetch(`http://localhost:8000/statuses/${id}`, {
      method: "PUT",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(status),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Ошибка обновления: ${errorData.message || "Неизвестная ошибка"}`);
    }

    return response.json();
  } catch (error) {
    console.error("Ошибка при обновлении статуса:", error);
    throw error;
  }
};

// Удалить статус
export const deleteCandidateStatus = async (id: number): Promise<boolean> => {
  try {
    const response = await fetch(`http://localhost:8000/statuses/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Ошибка при удалении статуса");
    }

    return true;
  } catch (error) {
    console.error("Ошибка при удалении статуса:", error);
    throw error;
  }
};
