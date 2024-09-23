import React from 'react';
import FloatingButton from "@/components/common/FloatingButton";
import {useRouter} from "next/router";
import {getCurrentUser} from '@/storage/auth';
import {useTranslation} from "@/utils/useTranslation";
import Skeleton from "@/components/common/Skeleton";
import withAuth from "@/hoc/withAuth";

const LettersOut: React.FC = () => {
    const router = useRouter();
    const text = useTranslation();

    const handleCreate = () => {
        router.push('/letters/out/create').then();
    };

    const user = getCurrentUser();
    return (
        <section className="antialiased">
            {user.role == 'Pelaksana' || user.role == 'External' && (<FloatingButton onClick={handleCreate}/>)}
            <div className="max-w-screen-xl mx-auto">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">{text('letters_out')}</h1>
            </div>
            <div className="w-full">
                <Skeleton type="file"/>
                <Skeleton/>
            </div>
        </section>
    );
};

export default withAuth(LettersOut, ["Tata Usaha", "Pejabat", "Pelaksana", "External"]);
