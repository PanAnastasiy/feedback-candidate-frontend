import {getAuthHeaders} from "../utils/getAuthHeaders";
import {Skill} from "../types/Skill";

 export const getAllSkills = async () => {
    return await fetch("http://localhost:8000/skills", {
        method: "GET",  // Added method for clarity
        mode: "cors",
        headers: getAuthHeaders(),
    }).then(function (response) {
        console.log("API URL:", `${process.env.REACT_APP_API_HOST}/skills`);
        console.log("Response status:", response.status);
        console.log("Response headers:", response.headers);
        return response.json();
    });
};

 export const createSkill = async (skill: Omit<Skill, 'id'>) => {
     try {
         const response = await fetch("http://localhost:8000/skills", {
             method: "POST",
             headers: getAuthHeaders(),
             body: JSON.stringify(skill),
         });

         if (!response.ok) {
             const errorData = await response.json(); // получаем структурированные данные ошибки
             if (response.status === 409) {
                 throw new Error(errorData.message || 'Такой навык уже существует.');
             } else {
                 throw new Error(`Ошибка ${response.status}: ${errorData.message || 'Неизвестная ошибка'}`);
             }
         }

         return response.json();
     } catch (error) {
         console.error('Ошибка:', error);
         throw error;
     }
 };


export const updateSkill = async (id: number, skill: Omit<Skill, 'id'>) => {
    try {
        const response = await fetch(`http://localhost:8000/skills/${id}`, {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify(skill),
        });

        if (!response.ok) {
            throw new Error('Ошибка при обновлении навыка');
        }

        return response.json();
    } catch (error) {
        console.error('Ошибка:', error);
        throw error;
    }
};

export const deleteSkill = async (id: number) => {
    try {
        const response = await fetch(`http://localhost:8000/skills/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error('Ошибка при удалении навыка');
        }

        return true;
    } catch (error) {
        console.error("Ошибка при удалении навыка:", error);
        throw error;
    }
};
