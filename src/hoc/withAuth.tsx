import {useRouter} from 'next/router';
import React, {useEffect} from 'react';
import {getCurrentUser} from '@/storage/auth';
import {useLoader} from '@/contexts/LoadingContext';
import Skeleton from "@/components/common/Skeleton";

const withAuth = (Component: React.ComponentType, allowedRoles: string[] = []) => {
    const AuthenticatedComponent = (props: any) => {
        const router = useRouter();
        const setLoading = useLoader();
        const user = getCurrentUser();

        useEffect(() => {
            setLoading(true);

            if (!user) {
                router.push('/login').then();
            } else if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
                router.push('/').then();
            }

            setLoading(false);
        }, [user, router, setLoading]);

        if (!user || (allowedRoles.length > 0 && !allowedRoles.includes(user.role))) {
            return <Skeleton/>;
        }

        return <Component {...props} />;
    };

    AuthenticatedComponent.displayName = `WithAuth(${Component.displayName || 'Component'})`;

    return AuthenticatedComponent;
};

export default withAuth;
