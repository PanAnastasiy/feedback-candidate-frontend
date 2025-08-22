import { useNavigate } from "react-router-dom";

export const useNavigation = () => {
    const navigate = useNavigate();
    const navigateTo = (route: string) => {
        navigate(route);
    };

    return {
        navigateTo,
    };
};