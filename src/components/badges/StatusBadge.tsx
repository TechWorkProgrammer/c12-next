import React from 'react';
import { useTranslation } from '@/utils/useTranslation';

interface StatusBadgeProps {
    status: 'dibaca' | 'belum dibaca' | 'disposisi' | 'dilaksanakan' | string;
    onClick?: () => void;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, onClick }) => {
    const translation = useTranslation();

    const getStatusStyles = () => {
        const lowerStatus = status.toLowerCase();

        if (lowerStatus.includes('disposisi')) {
            const match = lowerStatus.match(/\d+$/);
            const dispositionLevel = match ? match[0] : '';
            return {
                text: `${translation('disposition')} ${dispositionLevel}`,
                icon: (
                    <svg
                        className="w-4 h-4 mr-1 text-blue-800"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M10 3v4a1 1 0 0 1-1 1H5m4 6 2 2 4-4m4-8v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1Z"
                        />
                    </svg>
                ),
                bgColor: 'bg-blue-100 text-blue-800 dark:bg-blue-200 dark:text-blue-800',
            };
        }

        switch (lowerStatus) {
            case 'dibaca':
                return {
                    text: translation('read'),
                    icon: (
                        <svg
                            className="w-4 h-4 mr-1 text-green-800"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M18 5V4a1 1 0 0 0-1-1H8.914a1 1 0 0 0-.707.293L4.293 7.207A1 1 0 0 0 4 7.914V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5M9 3v4a1 1 0 0 1-1 1H4m11.383.772 2.745 2.746m1.215-3.906a2.089 2.089 0 0 1 0 2.953l-6.65 6.646L9 17.95l.739-3.692 6.646-6.646a2.087 2.087 0 0 1 2.958 0Z"
                            />
                        </svg>
                    ),
                    bgColor: 'bg-green-100 text-green-800 dark:bg-green-200',
                };
            case 'belum dibaca':
                return {
                    text: translation('unread'),
                    icon: (
                        <svg
                            className="w-4 h-4 mr-1 text-yellow-800"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M10 3v4a1 1 0 0 1-1 1H5m4 8h6m-6-4h6m4-8v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1Z"
                            />
                        </svg>
                    ),
                    bgColor: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-200',
                };
            case 'dilaksanakan':
                return {
                    text: translation('executed'),
                    icon: (
                        <svg
                            className="w-4 h-4 mr-1 text-blue-800"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M10 3v4a1 1 0 0 1-1 1H5m4 6 2 2 4-4m4-8v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1Z"
                            />
                        </svg>
                    ),
                    bgColor: 'bg-blue-100 text-blue-800 dark:bg-blue-200 dark:text-blue-800',
                };
            default:
                return {
                    text: translation(lowerStatus),
                    icon: (
                        <svg
                            className="w-4 h-4 mr-1 text-gray-800 dark:text-gray-700"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M10 3v4a1 1 0 0 1-1 1H5m8 7.5 2.5 2.5M19 4v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1Zm-5 9.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
                            />
                        </svg>
                    ),
                    bgColor: 'bg-gray-100 text-gray-800 dark:bg-gray-200',
                };
        }
    };

    const { text, icon, bgColor } = getStatusStyles();

    return (
        <span onClick={onClick} className={`text-sm font-bold inline-flex items-center ps-1 pe-2 py-0.5 rounded ${bgColor}`}>
            {icon}
            {text}
        </span>
    );
};

export default StatusBadge;
