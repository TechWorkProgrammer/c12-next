import React from 'react';
import ThemeProvider from '@/contexts/ThemeContext';
import AlertProvider from '@/contexts/AlertContext';
import '@/styles/globals.css';
import Head from 'next/head';
import Layout from '@/components/Layout';
import {getRouteName, is404Page} from "@/utils/routeName";
import {useRouter} from "next/router";

interface MyAppProps {
    Component: React.ComponentType<any>;
    pageProps: any;
}

function MyApp({Component, pageProps}: MyAppProps) {
    const router = useRouter();
    const initialTitle = `${getRouteName(router.pathname)} | Akmil E-Office`;
    const withoutLayout = is404Page(router.pathname);

    return (
        <ThemeProvider>
            <AlertProvider>
                <Head>
                    <title>{initialTitle}</title>
                </Head>
                {!withoutLayout ? (
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                ) : (
                    <Component {...pageProps} />
                )}
            </AlertProvider>
        </ThemeProvider>
    );
}

export default MyApp;
