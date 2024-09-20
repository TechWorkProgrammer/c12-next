import axios from 'axios';
import {getToken, logoutUser} from '@/storage/auth';

const client = axios.create({
    baseURL: "http://localhost:8000",
    timeout: 60000,
});

client.interceptors.request.use(async (config) => {
    if (await getToken()) {
        config.headers.Authorization = `Bearer ${await getToken()}`;
    }
    config.headers['content-type'] = 'application/x-www-form-urlencoded';
    config.headers.Accept = 'application/json';
    return config;
});

client.interceptors.response.use(
    (response) => response.data,
    async (error) => {
        if (error.response?.status === 403) {
            await logoutUser();
            throw new Error(error.response.data.message);
        } else if (error.response) {
            throw new Error(error.response.data.message || 'An error occurred');
        } else {
            throw new Error(error.message || 'A network error occurred');
        }
    }
);

export default client;
