import React from 'react';
import Input from '@/components/forms/Input';
import Button from "@/components/common/Button";

const Login: React.FC = () => {
    return (
        <div
            className="max-w-sm mx-auto my-8 p-4 pt-8 space-y-4 bg-white rounded-lg shadow-lg dark:bg-gray-800 dark:border dark:border-gray-700">
            <h1 className="text-xl font-semibold text-gray-700 dark:text-gray-300 text-center">
                Login Ke Akun Kamu
            </h1>
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
            <Button label={'Login'} onClick={() => {
            }}/>
        </div>
    );
};

export default Login;
