export interface EmployeeFullProfile {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    hire_date: string;
    profile: {
        birth_date: string;
        address: string;
        city: string;
        gender: string;
        nationality: string;
        phone_number: string;
    };
    user: {
        username: string;
        role: string;
    };
    projects: {
        name: string;
        start_date: string;
        end_date: string;
        description: string;
    }[];
    positions: {
        name: string;
        start_date: string;
        end_date: string;
        description: string;
    }[];
    technologies: {
        name: string;
        skill_level: string;
        description: string;
    }[];
}
