export interface EmployeeProject {
    employeeId: number;
    fullName: string;
    description: string | null;
    startDate: string; // Лучше оставить string, так как с сервера даты приходят как строки
    endDate: string;
}

export interface Project {
    id: number;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    employeeProjects: EmployeeProject[];
}
