import React from "react";
import Link from "next/link";
import {useTranslation} from "@/utils/useTranslation";

const Footer: React.FC = () => {
    const text = useTranslation();
    return (
        <footer className="p-4 w-full border-t-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div
                className="max-w-screen-xl mt-4 mx-auto flex flex-col items-center text-center space-y-3 md:space-y-4 lg:space-y-6">
                <Link
                    href="/"
                    className="flex flex-col gap-4 items-center space-x-2 text-xl font-semibold text-gray-700 dark:text-gray-300 md:text-2xl lg:text-3xl"
                >
                    <span>SPARTI</span>
                </Link>
                <p className="text-gray-500 lg:px-16 dark:text-gray-400 text-xs md:text-sm lg:text-base xl:text-lg">
                    {text('content:description')}
                </p>
                <span className="text-xs text-gray-500 dark:text-gray-400 md:text-sm lg:text-base">
                    © 2024 SPARTI.
                </span>
            </div>
        </footer>
    );
};

export default Footer;
