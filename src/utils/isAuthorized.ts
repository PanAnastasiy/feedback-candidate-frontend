export const isAuthorized = () => {
    const token = localStorage.getItem("token");

    return !!token;
};