import React, {useState} from 'react';
import Input from '@/components/forms/Input';
import Button from "@/components/common/Button";
import {loginUser} from '@/storage/userStorage';
import {useAlert} from "@/contexts/AlertContext";
import {useRouter} from "next/router";

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const alert = useAlert();
    const router = useRouter();

    const handleLogin = async () => {
        const user = await loginUser(email, password);
        if (user) {
            alert.success('Login berhasil, selamat datang ' + user.name);
            router.push('/').then();
        } else {
            alert.danger('Email atau Password Salah.');
        }
    };

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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <Input
                id="password"
                label="Password Kamu"
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button label="Login" onClick={handleLogin}/>
        </div>
    );
};

export default Login;
