import React from 'react';
import Link from "next/link";
import {useTranslation} from "@/utils/useTranslation";

const Custom404: React.FC = () => {
    const text = useTranslation();
    return (
        <main className="w-screen h-screen flex items-center bg-gray-50 dark:bg-gray-900">
            <section className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                <div className="mx-auto max-w-screen-sm text-center">
                    <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-gray-700 dark:text-gray-500">404</h1>
                    <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-gray-200">
                        {text("page_not_found")}
                    </p>
                    <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
                        {text("message:not_found")}
                    </p>
                    <Link href="/"
                          className="inline-flex text-white bg-gray-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4">
                        {text('back_to_home')}
                    </Link>
                </div>
            </section>
        </main>
    );
};

export default Custom404;
