import { getAuthHeaders} from '../utils/getAuthHeaders';
import { CandidateStatus } from '../types/CandidateStatus';
import {getApiEndpoint} from "../configs/app";

// Получить все статусы
export const getCandidateStatuses = async (): Promise<CandidateStatus[]> => {
  const response = await fetch(getApiEndpoint("/statuses"), {
    method: "GET",
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
  const response = await fetch(getApiEndpoint("/statuses"), {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(status),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    if (response.status === 409) {
      throw new Error(errorData.message || "Такой статус уже существует.");
    } else {
      throw new Error(`Ошибка ${response.status}: ${errorData.message || "Неизвестная ошибка"}`);
    }
  }

  return response.json();
};

// Обновить статус по ID
export const updateCandidateStatus = async (id: number, status: Omit<CandidateStatus, 'id'>): Promise<CandidateStatus> => {
  const response = await fetch(getApiEndpoint(`/statuses/${id}`), {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(status),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Ошибка обновления: ${errorData.message || "Неизвестная ошибка"}`);
  }

  return response.json();
};

// Удалить статус
export const deleteCandidateStatus = async (id: number): Promise<boolean> => {
  const response = await fetch(getApiEndpoint(`/statuses/${id}`), {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Ошибка при удалении статуса");
  }

  return true;
};
