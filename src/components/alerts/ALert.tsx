import React from 'react';

interface AlertProps {
    title: string;
    message: string;
    countdown?: number;
    onAccept?: () => void | null;
    onDismiss: () => void;
}

export const DangerAlert: React.FC<AlertProps> = ({title, message, countdown, onAccept, onDismiss}) => (
    <div
        className="w-full max-w-lg h-fit p-4 my-auto mx-4 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:border-red-800">
        <div className="flex items-center justify-between">
            <div className="flex items-center">
                <svg
                    className="flex-shrink-0 w-4 h-4 me-2 text-red-800 dark:text-red-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path
                        d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                </svg>
                <h3 className="text-lg font-medium text-red-800 dark:text-red-400">{title}</h3>
            </div>
            {countdown !== undefined && countdown > 0 && (
                <span className="text-xs text-red-800 dark:text-red-400">{countdown}</span>)}
        </div>
        <div className="mt-2 mb-4 text-sm text-red-800 dark:text-red-400">{message}</div>
        <div className="flex justify-end">
            {onAccept && (
                <button
                    className="text-white bg-red-800 hover:bg-red-900 focus:ring-4 focus:outline-none font-medium rounded-lg text-xs px-3 py-1.5 me-2"
                    onClick={onAccept}
                >
                    Confirm
                </button>
            )}
            <button
                className="text-red-800 bg-transparent border border-red-800 hover:bg-red-900 hover:text-red-900 focus:ring-4 focus:outline-none font-medium rounded-lg text-xs px-3 py-1.5 dark:hover:bg-red-600 dark:text-red-400 dark:border-red-600 dark:hover:text-white"
                onClick={onDismiss}
            >
                Close
            </button>
        </div>
    </div>
);


export const InfoAlert: React.FC<AlertProps> = ({title, message, countdown, onAccept, onDismiss}) => (
    <div
        className="w-full max-w-lg h-fit p-4 my-auto mx-4 border border-blue-300 rounded-lg bg-blue-50 dark:bg-gray-800 dark:border-blue-800">
        <div className="flex items-center justify-between">
            <div className="flex items-center">
                <svg
                    className="flex-shrink-0 w-4 h-4 me-2 text-blue-800 dark:text-blue-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path
                        d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                </svg>
                <h3 className="text-lg font-medium text-blue-800 dark:text-blue-400">{title}</h3>
            </div>
            {countdown !== undefined && countdown > 0 && (
                <span className="text-xs text-blue-800 dark:text-blue-400">{countdown}</span>)}
        </div>
        <div className="mt-2 mb-4 text-sm text-blue-800 dark:text-blue-400">{message}</div>
        <div className="flex justify-end">
            {onAccept && (
                <button
                    className="text-white bg-blue-800 hover:bg-blue-900 focus:ring-4 focus:outline-none font-medium rounded-lg text-xs px-3 py-1.5 me-2"
                    onClick={onAccept}
                >
                    Confirm
                </button>
            )}
            <button
                className="text-blue-800 bg-transparent border border-blue-800 hover:bg-blue-900 hover:text-blue-900 focus:ring-4 focus:outline-none font-medium rounded-lg text-xs px-3 py-1.5 dark:hover:bg-blue-600 dark:text-blue-400 dark:border-blue-600 dark:hover:text-white"
                onClick={onDismiss}
            >
                Close
            </button>
        </div>
    </div>
);

export const WarningAlert: React.FC<AlertProps> = ({title, message, countdown, onAccept, onDismiss}) => (
    <div
        className="w-full max-w-lg h-fit p-4 my-auto mx-4 border border-yellow-300 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:border-yellow-800">
        <div className="flex items-center justify-between">
            <div className="flex items-center">
                <svg
                    className="flex-shrink-0 w-4 h-4 me-2 text-yellow-800 dark:text-yellow-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path
                        d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                </svg>
                <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-400">{title}</h3>
            </div>
            {countdown !== undefined && countdown > 0 && (
                <span className="text-xs text-yellow-800 dark:text-yellow-400">{countdown}</span>)}
        </div>
        <div className="mt-2 mb-4 text-sm text-yellow-800 dark:text-yellow-400">{message}</div>
        <div className="flex justify-end">
            {onAccept && (
                <button
                    className="text-white bg-yellow-800 hover:bg-yellow-900 focus:ring-4 focus:outline-none font-medium rounded-lg text-xs px-3 py-1.5 me-2"
                    onClick={onAccept}
                >
                    Confirm
                </button>
            )}
            <button
                className="text-yellow-800 bg-transparent border border-yellow-800 hover:bg-yellow-900 hover:text-yellow-900 focus:ring-4 focus:outline-none font-medium rounded-lg text-xs px-3 py-1.5 dark:hover:bg-yellow-600 dark:text-yellow-400 dark:border-yellow-600 dark:hover:text-white"
                onClick={onDismiss}
            >
                Close
            </button>
        </div>
    </div>
);

export const SuccessALert: React.FC<AlertProps> = ({title, message, countdown, onAccept, onDismiss}) => (
    <div
        className="w-full max-w-lg h-fit p-4 my-auto mx-4 border border-green-300 rounded-lg bg-green-50 dark:bg-gray-800 dark:border-green-800">
        <div className="flex items-center justify-between">
            <div className="flex items-center">
                <svg
                    className="flex-shrink-0 w-4 h-4 me-2 text-green-800 dark:text-green-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path
                        d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                </svg>
                <h3 className="text-lg font-medium text-green-800 dark:text-green-400">{title}</h3>
            </div>
            {countdown !== undefined && countdown > 0 && (
                <span className="text-xs text-green-800 dark:text-green-400">{countdown}</span>)}
        </div>
        <div className="mt-2 mb-4 text-sm text-green-800 dark:text-green-400">{message}</div>
        <div className="flex justify-end">
            {onAccept && (
                <button
                    className="text-white bg-green-800 hover:bg-green-900 focus:ring-4 focus:outline-none font-medium rounded-lg text-xs px-3 py-1.5 me-2"
                    onClick={onAccept}
                >
                    Confirm
                </button>
            )}
            <button
                className="text-green-800 bg-transparent border border-green-800 hover:bg-green-900 hover:text-green-900 focus:ring-4 focus:outline-none font-medium rounded-lg text-xs px-3 py-1.5 dark:hover:bg-green-600 dark:text-green-400 dark:border-green-600 dark:hover:text-white"
                onClick={onDismiss}
            >
                Close
            </button>
        </div>
    </div>
);

export const DarkAlert: React.FC<AlertProps> = ({title, message, countdown, onAccept, onDismiss}) => (
    <div
        className="w-full max-w-lg h-fit p-4 my-auto mx-4 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-800">
        <div className="flex items-center justify-between">
            <div className="flex items-center">
                <svg
                    className="flex-shrink-0 w-4 h-4 me-2 text-gray-800 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path
                        d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                </svg>
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-400">{title}</h3>
            </div>
            {countdown !== undefined && countdown > 0 && (
                <span className="text-xs text-gray-800 dark:text-gray-400">{countdown}</span>)}
        </div>
        <div className="mt-2 mb-4 text-sm text-gray-800 dark:text-gray-400">{message}</div>
        <div className="flex justify-end">
            {onAccept && (
                <button
                    className="text-white bg-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none font-medium rounded-lg text-xs px-3 py-1.5 me-2"
                    onClick={onAccept}
                >
                    Confirm
                </button>
            )}
            <button
                className="text-gray-800 bg-transparent border border-gray-800 hover:bg-gray-900 hover:text-gray-900 focus:ring-4 focus:outline-none font-medium rounded-lg text-xs px-3 py-1.5 dark:hover:bg-gray-600 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white"
                onClick={onDismiss}
            >
                Close
            </button>
        </div>
    </div>
);


