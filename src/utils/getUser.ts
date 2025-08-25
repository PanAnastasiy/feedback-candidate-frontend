export const getUser = () => {
    const token = localStorage.getItem('token');
    const user_id = localStorage.getItem('user_id');

    return token ? { user_id } : {};
};