
import { Candidate, CandidateCreate, CandidateUpdate } from "../types/Candidate";
import { getAuthHeaders } from "../utils/getAuthHeaders";

const API_URL = process.env.REACT_APP_API_HOST || "http://localhost:8000";

export const getAllCandidates = async () => {
  const response = await fetch('http://localhost:8000/candidates');
  const data = await response.json();
  console.log("API candidates response:", data);
  return data;
};

export const getCandidateById = async (id: number): Promise<Candidate> => {
  const response = await fetch(`${API_URL}/candidates/${id}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Кандидат не найден");
  return await response.json();
};

export const searchCandidates = async (query: string): Promise<Candidate[]> => {
  const response = await fetch(`${API_URL}/candidates?search=${encodeURIComponent(query)}`, {
    headers: getAuthHeaders(),
  });
  return await response.json();
};

export const createCandidate = async (candidate: CandidateCreate): Promise<Candidate> => {
  const response = await fetch(`${API_URL}/candidates`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(candidate),
  });
  if (!response.ok) throw new Error("Ошибка при создании кандидата");
  return await response.json();
};

export const updateCandidate = async (id: number, candidate: CandidateUpdate): Promise<Candidate> => {
  const response = await fetch(`${API_URL}/candidates/${id}`, {
    method: "PUT",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(candidate),
  });
  if (!response.ok) throw new Error("Ошибка при обновлении кандидата");
  return await response.json();
};

export const deleteCandidate = async (id: number): Promise<boolean> => {
  const response = await fetch(`${API_URL}/candidates/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Ошибка при удалении кандидата");
  return true;
};
