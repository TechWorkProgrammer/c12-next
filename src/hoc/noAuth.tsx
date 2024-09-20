import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { getCurrentUser } from '@/storage/auth';

const noAuth = (WrappedComponent: React.ComponentType) => {
    const Wrapper = (props: any) => {
        const router = useRouter();

        useEffect(() => {
            const user = getCurrentUser();

            if (user) {
                router.push('/').then();
            }
        }, [router]);

        return <WrappedComponent {...props} />;
    };

    Wrapper.displayName = `noAuth(${WrappedComponent.displayName || 'Component'})`;

    return Wrapper;
};

export default noAuth;
