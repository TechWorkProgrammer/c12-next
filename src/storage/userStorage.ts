export const setUserEmail = (email: string) => {
    localStorage.setItem('userEmail', email);
};

export const getUserEmail = (): string | null => {
    if (localStorage.getItem('userEmail')) {
        return localStorage.getItem('userEmail');
    }
    return null
};

export const removeUserEmail = () => {
    localStorage.removeItem('userEmail');
};
