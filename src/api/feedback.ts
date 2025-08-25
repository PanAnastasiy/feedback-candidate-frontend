import { SectionWithKeywords, FeedbackItem } from '../types/Feedback';
import { getAuthHeaders} from "../utils/getAuthHeaders";
import {getApiEndpoint} from "../configs/app";

export const saveFinalFeedback = async (feedbackPayload: any) => {
  const method = feedbackPayload.id ? 'PUT' : 'POST';
  const url = feedbackPayload.id
    ? getApiEndpoint(`/feedbacks/${feedbackPayload.id}`)
    : getApiEndpoint('/feedbacks');

  console.log('Отправка фидбека на сервер:');
  console.log('Метод:', method);
  console.log('URL:', url);
  console.log('Payload (объект):', feedbackPayload);
  console.log('Payload (JSON):', JSON.stringify(feedbackPayload));

  const res = await fetch(url, {
    method,
    headers: getAuthHeaders(),
    body: JSON.stringify(feedbackPayload),
  });

  if (!res.ok) {
    throw new Error('Ошибка при сохранении фидбека');
  }

  return await res.json();
};

export const generateFeedbackForSection = async (
  section_name: string,
  keywords: string,
  skills: { name: string; level: number }[]
) => {
  const res = await fetch(getApiEndpoint('/generate'), {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ section_name, keywords, skills }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Ошибка запроса' }));
    throw new Error(err.detail || 'Ошибка генерации фидбека');
  }

  const data = await res.json();
  return data.generated_text;
};

export const getFeedbackByCandidateId = async (candidateId: number) => {
  const res = await fetch(getApiEndpoint(`/feedbacks/${candidateId}`), {
    headers: getAuthHeaders(),
  });

  if (res.status === 404) {
    // Фидбека еще нет — это не ошибка
    return { items: [], final_feedback: '' };
  }

  if (!res.ok) {
    throw new Error('Не удалось загрузить фидбек');
  }

  return await res.json();
};
