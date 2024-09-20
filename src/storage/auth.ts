import client from '@/api/client';

export function setToken(token: string) {
    try {
        localStorage.setItem('token', token);
    } catch (error) {
        console.error('Error setting token:', error);
    }
}

export function clearToken() {
    try {
        localStorage.removeItem('token');
    } catch (error) {
        console.error('Error clearing token:', error);
    }
}

export function getToken(): string | null {
    try {
        return localStorage.getItem('token');
    } catch (error) {
        console.error('Error getting token:', error);
        return null;
    }
}

export async function loginUser(email: string, password: string) {
    const response = await client.post('/login', {email, password});
    const {token, user} = response.data;

    if (token) {
        setToken(token);
        localStorage.setItem('currentUser', JSON.stringify(user));
        return user;
    } else {
        console.error('Invalid credentials');
    }
}

export function getCurrentUser() {
    if (typeof window !== "undefined") {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    }
    return null;
}

export async function logoutUser() {
    try {
        const token = getToken();
        if (token) {
            await client.post('/logout');
        }
        clearToken();
        localStorage.removeItem('currentUser');
    } catch (error) {
        console.error('Error during logout:', error);
    } finally {
        window.location.href = '/login';
    }
}
