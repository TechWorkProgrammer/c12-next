import React from 'react';

interface ClassificationBadgeProps {
    classification: 'rahasia' | 'biasa' | 'segera';
}

const ClassificationBadge: React.FC<ClassificationBadgeProps> = ({classification}) => {
    const getClassificationStyles = () => {
        switch (classification) {
            case 'rahasia':
                return {
                    icon: (
                        <svg
                            className="w-4 h-4 mr-1 text-red-800"
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
                                d="M18 9V4a1 1 0 0 0-1-1H8.914a1 1 0 0 0-.707.293L4.293 7.207A1 1 0 0 0 4 7.914V20a1 1 0 0 0 1 1h6M9 3v4a1 1 0 0 1-1 1H4m11 13a11.426 11.426 0 0 1-3.637-3.99A11.139 11.139 0 0 1 10 11.833L15 10l5 1.833a11.137 11.137 0 0 1-1.363 5.176A11.425 11.425 0 0 1 15.001 21Z"
                            />
                        </svg>
                    ),
                    bgColor: 'bg-red-100 text-red-800 dark:bg-red-200',
                };
            case 'biasa':
                return {
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
                                d="M10 3v4a1 1 0 0 1-1 1H5m4 8h6m-6-4h6m4-8v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1Z"
                            />
                        </svg>
                    ),
                    bgColor: 'bg-blue-100 text-blue-800 dark:bg-blue-200',
                };
            case 'segera':
                return {
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
                                d="M10 3v4a1 1 0 0 1-1 1H5m8 7.5 2.5 2.5M19 4v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1Zm-5 9.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
                            />
                        </svg>
                    ),
                    bgColor: 'bg-green-100 text-green-800 dark:bg-green-200',
                };
            default:
                return {
                    icon: (
                        <svg
                            className="w-4 h-4 text-gray-800 dark:text-white"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M10 3v4a1 1 0 0 1-1 1H5m14-4v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1Z"
                            />
                        </svg>
                    ), bgColor: 'bg-gray-100 text-gray-800 dark:bg-gray-200 dark:text-gray-800'
                };
        }
    };

    const {icon, bgColor} = getClassificationStyles();

    return (
        <span className={`text-sm font-bold inline-flex items-center ps-1 pe-2 py-0.5 rounded ${bgColor}`}>
            {icon}
            {classification.charAt(0).toUpperCase() + classification.slice(1)}
        </span>
    );
};

export default ClassificationBadge;
