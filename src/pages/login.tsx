import React from 'react';
import Input from '@/components/forms/Input';

const Login: React.FC = () => {
    return (
        <div
            className="max-w-screen-sm mx-auto my-8 px-4 py-8 sm:p-8 space-y-8 bg-white rounded-lg shadow-lg dark:bg-gray-800 dark:border dark:border-gray-700">
            <h1 className="text-xl font-semibold text-gray-700 dark:text-gray-300 text-center">
                Login Ke Akun Kamu
            </h1>
            <form className="space-y-4">
                <Input
                    id="email"
                    label="Email Kamu"
                    type="email"
                    placeholder="name@company.com"
                    required
                />
                <Input
                    id="password"
                    label="Password Kamu"
                    type="password"
                    placeholder="••••••••"
                    required
                />
                <button
                    type="submit"
                    className="w-full px-5 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;
