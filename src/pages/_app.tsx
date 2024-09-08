import React from 'react';
import {ThemeProvider} from '@/contexts/ThemeContext';
import '@/styles/globals.css';
import Head from 'next/head';
import {useRouter} from 'next/router';
import Layout from '@/components/Layout';

function MyApp({Component, pageProps}) {
    const router = useRouter();

    const getPageTitle = (path: string) => {
        const baseRoute = path.split('/')[1] || 'Dashboard';
        const routeName = baseRoute.charAt(0).toUpperCase() + baseRoute.slice(1);
        return `${routeName} | E-Office`;
    };

    const initialTitle = getPageTitle(router.pathname);

    return (
        <ThemeProvider>
            <Head>
                <title>{initialTitle}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <meta charSet="UTF-8"/>
                <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
                <meta name="description" content="Aplikasi Sederhana untuk Mempermudah Pendataan Surat"/>
                <meta name="keywords" content="E-office"/>
                <meta name="author" content="E-office"/>
                <meta name="theme-color" content="#ffffff"/>

                <meta property="og:title" content="E-office"/>
                <meta property="og:description" content="Aplikasi Sederhana untuk Mempermudah Pendataan Surat"/>
                <meta property="og:type" content="website"/>
                <meta property="og:url" content="https://e-office.techwork.store"/>
                <meta property="og:image" content="/default.png"/>

                <meta name="twitter:card" content="E-office"/>
                <meta name="twitter:title" content="E-office"/>
                <meta name="twitter:description" content="Aplikasi Sederhana untuk Mempermudah Pendataan Surat"/>
                <meta name="twitter:image" content="/default.png"/>

                <link rel="icon" href="/default.png" type="image/x-icon"/>
                <link rel="apple-touch-icon" href="/default.png"/>

                <meta name="robots" content="E-office"/>
                <meta name="googlebot" content="E-office"/>
                <meta name="msapplication-TileColor" content="#ffffff"/>
                <meta name="msapplication-TileImage" content="/default.png"/>
            </Head>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </ThemeProvider>
    );
}

export default MyApp;
