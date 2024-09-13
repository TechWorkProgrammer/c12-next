import Document, {Head, Html, Main, NextScript} from 'next/document';
import React from 'react';

class MyDocument extends Document {
    render() {
        return (
            <Html lang="id">
                <Head>
                    <meta charSet="UTF-8"/>
                    <meta name="description" content="Aplikasi Sederhana untuk Mempermudah Pendataan Surat"/>
                    <meta name="keywords" content="E-office"/>
                    <meta name="author" content="E-office"/>

                    <meta property="og:title" content="E-office"/>
                    <meta property="og:description" content="Aplikasi Sederhana untuk Mempermudah Pendataan Surat"/>
                    <meta property="og:type" content="website"/>
                    <meta property="og:url" content="https://e-office.techwork.store"/>
                    <meta property="og:image" content="/default.png"/>

                    <meta name="twitter:card" content="summary_large_image"/>
                    <meta name="twitter:title" content="E-office"/>
                    <meta name="twitter:description" content="Aplikasi Sederhana untuk Mempermudah Pendataan Surat"/>
                    <meta name="twitter:image" content="/default.png"/>

                    <link rel="icon" href="/default.png" type="image/x-icon"/>
                    <link rel="apple-touch-icon" href="/default.png"/>

                    <meta name="robots" content="index, follow"/>
                    <meta name="googlebot" content="index, follow"/>
                    <meta name="msapplication-TileColor" content="#ffffff"/>
                    <meta name="msapplication-TileImage" content="/default.png"/>
                </Head>
                <body className="bg-gray-50 dark:bg-gray-900">
                <Main/>
                <NextScript/>
                </body>
            </Html>
        );
    }
}

export default MyDocument;
