import React from 'react';
import Link from 'next/link';
import {useTheme} from "@/contexts/ThemeContext";

interface HeaderProps {
    toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({toggleSidebar}) => {
    const {sidebarPosition} = useTheme();

    return (
        <header
            className="fixed top-0 left-0 right-0 z-30 w-full bg-white border-b-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800">
            <nav
                className={`flex items-center px-4 lg:px-6 py-3 ${
                    sidebarPosition === 'right'
                        ? 'justify-between'
                        : 'justify-start'
                }`}
            >
                {sidebarPosition === 'left' && (
                    <button
                        onClick={toggleSidebar}
                        className="p-2 text-gray-600 rounded hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
                    >
                        <svg
                            className="w-5 h-5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 16 12"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M1 1h14M1 6h14M1 11h7"
                            />
                        </svg>
                    </button>
                )}
                <Link href="/" className="mx-2 md:mx-4">
                    <span className="text-xl font-semibold text-gray-700 dark:text-gray-300 text-center">
                        SPARTI
                    </span>
                </Link>

                {sidebarPosition === 'right' && (

                    <button
                        onClick={toggleSidebar}
                        className="p-2 text-gray-600 rounded hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
                    >
                        <svg
                            className="w-5 h-5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 16 12"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M1 1h14M1 6h14M1 11h7"
                            />
                        </svg>
                    </button>
                )}
            </nav>
        </header>
    );
};

export default Header;
