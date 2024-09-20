import React from 'react';
import ThemeProvider from '@/contexts/ThemeContext';
import AlertProvider from '@/contexts/AlertContext';
import '@/styles/globals.css';
import Layout from '@/components/Layout';
import {is404Page} from "@/utils/useRouteName";
import {useRouter} from "next/router";
import LoadingProvider from "@/contexts/LoadingContext";
import LanguageProvider from "@/contexts/LanguageContext";
import HeadTitle from '@/components/HeadTitle';

interface MyAppProps {
    Component: React.ComponentType<any>;
    pageProps: any;
}

function MyApp({Component, pageProps}: MyAppProps) {
    const router = useRouter();
    const withoutLayout = is404Page(router.pathname);

    return (
        <LoadingProvider>
            <LanguageProvider>
                <ThemeProvider>
                    <AlertProvider>
                        <HeadTitle/>
                        {!withoutLayout ? (
                            <Layout>
                                <Component {...pageProps} />
                            </Layout>
                        ) : (
                            <Component {...pageProps} />
                        )}
                    </AlertProvider>
                </ThemeProvider>
            </LanguageProvider>
        </LoadingProvider>
    );
}

export default MyApp;
