import React, { useState } from 'react';
import Input from '@/components/forms/Input';
import Button from "@/components/common/Button";
import { loginUser } from '@/storage/auth';
import { useRouter } from "next/router";
import { useAlert } from "@/contexts/AlertContext";
import { useLoader } from "@/contexts/LoadingContext";
import noAuth from '@/hoc/noAuth';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const alert = useAlert();
    const router = useRouter();
    const setLoading = useLoader();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            const user = await loginUser(email, password);
            setLoading(false);
            alert.success('Login berhasil, selamat datang ' + user.name, true, undefined, () => {
                router.push('/').then();
            });
        } catch (error) {
            setLoading(false);
            alert.danger(error.message);
        }
    };

    return (
        <div
            className="max-w-sm mx-auto my-8 p-4 pt-8 space-y-4 bg-white rounded-lg shadow-lg dark:bg-gray-800 dark:border dark:border-gray-700">
            <h1 className="text-xl font-semibold text-gray-700 dark:text-gray-300 text-center">
                Login Ke Akun Kamu
            </h1>
            <form onSubmit={handleLogin}>
                <Input
                    id="email"
                    label="Email Kamu"
                    type="email"
                    placeholder="name@sparti.online"
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
                <Button label="Login" onClick={()=> handleLogin} />
            </form>
        </div>
    );
};

export default noAuth(Login);
