import { Candidate, CandidateCreate, CandidateUpdate } from "../types/Candidate";
import { getAuthHeaders } from "../utils/getAuthHeaders";
import {getApiEndpoint} from "../configs/app"; // предположим, что getApiEndpoint там же

export const getAllCandidates = async (): Promise<Candidate[]> => {
  const response = await fetch(getApiEndpoint("/candidates"), {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Ошибка при получении кандидатов");
  const data = await response.json();
  console.log("API candidates response:", data);
  return data;
};

export const getCandidateById = async (id: number): Promise<Candidate> => {
  const response = await fetch(getApiEndpoint(`/candidates/${id}`), {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Кандидат не найден");
  return await response.json();
};

export const searchCandidates = async (query: string): Promise<Candidate[]> => {
  const response = await fetch(getApiEndpoint(`/candidates?search=${encodeURIComponent(query)}`), {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Ошибка при поиске кандидатов");
  return await response.json();
};

export const createCandidate = async (candidate: CandidateCreate): Promise<Candidate> => {
  const response = await fetch(getApiEndpoint("/candidates"), {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(candidate),
  });
  if (!response.ok) throw new Error("Ошибка при создании кандидата");
  return await response.json();
};

export const updateCandidate = async (id: number, candidate: CandidateUpdate): Promise<Candidate> => {
  const response = await fetch(getApiEndpoint(`/candidates/${id}`), {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(candidate),
  });
  if (!response.ok) throw new Error("Ошибка при обновлении кандидата");
  return await response.json();
};

export const deleteCandidate = async (id: number): Promise<boolean> => {
  const response = await fetch(getApiEndpoint(`/candidates/${id}`), {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Ошибка при удалении кандидата");
  return true;
};

