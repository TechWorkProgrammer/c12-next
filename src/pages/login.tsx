import React, { useState } from 'react';
import Input from '@/components/forms/Input';
import Button from "@/components/common/Button";
import { loginUser } from '@/storage/auth';
import { useRouter } from "next/router";
import { useAlert } from "@/contexts/AlertContext";
import { useLoader } from "@/contexts/LoadingContext";
import noAuth from '@/hoc/noAuth';
import {useTranslation} from "@/utils/useTranslation";

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const alert = useAlert();
    const router = useRouter();
    const text = useTranslation();
    const setLoading = useLoader();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            const user = await loginUser(email, password);
            setLoading(false);
            alert.success(text('message:login_success') + user.name, true, undefined, () => {
                router.push('/').then();
            });
        } catch (error: any) {
            setLoading(false);
            alert.danger(error.message || text('message:login_failed'));
        }
    };

    return (
        <div
            className="max-w-sm mx-auto my-8 p-4 pt-8 space-y-4 bg-white rounded-lg shadow-lg dark:bg-gray-800 dark:border dark:border-gray-700">
            <h1 className="text-xl font-semibold text-gray-700 dark:text-gray-300 text-center">
                {text('content:input:login:label')}
            </h1>
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <Input
                    id="email"
                    label={text('content:input:login:email_label')}
                    type="email"
                    placeholder="name@sparti.online"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                    id="password"
                    label={text('content:input:login:password_label')}
                    type="password"
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button label={text('login')} onClick={()=> handleLogin} />
            </form>
        </div>
    );
};

export default noAuth(Login);
