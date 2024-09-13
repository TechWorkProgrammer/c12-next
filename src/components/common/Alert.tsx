import React, { FC, useEffect, useState } from 'react';

interface AlertProps {
    type: 'info' | 'danger' | 'success' | 'warning' | 'dark';
    title: string;
    message: string;
    autoDismiss?: boolean;
    onDismiss: () => void;
    buttons?: { label: string; onClick: () => void }[];
}

const Alert: FC<AlertProps> = ({
                                   type,
                                   title,
                                   message,
                                   autoDismiss = false,
                                   onDismiss,
                                   buttons = [],
                               }) => {
    const [visible, setVisible] = useState(true);
    const [timeLeft, setTimeLeft] = useState(3);

    useEffect(() => {
        if (autoDismiss) {
            const interval = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        setVisible(false);
                        onDismiss();
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [autoDismiss, onDismiss]);

    if (!visible) return null;

    const getColorClasses = () => {
        switch (type) {
            case 'info':
                return {
                    textColor: 'text-blue-800',
                    borderColor: 'border-blue-300',
                    bgColor: 'bg-blue-50',
                    darkTextColor: 'dark:text-blue-400',
                    darkBorderColor: 'dark:border-blue-800',
                    darkBgColor: 'dark:bg-gray-800',
                    buttonBg: 'blue',
                };
            case 'danger':
                return {
                    textColor: 'text-red-800',
                    borderColor: 'border-red-300',
                    bgColor: 'bg-red-50',
                    darkTextColor: 'dark:text-red-400',
                    darkBorderColor: 'dark:border-red-800',
                    darkBgColor: 'dark:bg-gray-800',
                    buttonBg: 'red',
                };
            case 'success':
                return {
                    textColor: 'text-green-800',
                    borderColor: 'border-green-300',
                    bgColor: 'bg-green-50',
                    darkTextColor: 'dark:text-green-400',
                    darkBorderColor: 'dark:border-green-800',
                    darkBgColor: 'dark:bg-gray-800',
                    buttonBg: 'green',
                };
            case 'warning':
                return {
                    textColor: 'text-yellow-800',
                    borderColor: 'border-yellow-300',
                    bgColor: 'bg-yellow-50',
                    darkTextColor: 'dark:text-yellow-300',
                    darkBorderColor: 'dark:border-yellow-800',
                    darkBgColor: 'dark:bg-gray-800',
                    buttonBg: 'yellow',
                };
            case 'dark':
                return {
                    textColor: 'text-gray-800',
                    borderColor: 'border-gray-300',
                    bgColor: 'bg-gray-50',
                    darkTextColor: 'dark:text-gray-300',
                    darkBorderColor: 'dark:border-gray-800',
                    darkBgColor: 'dark:bg-gray-800',
                    buttonBg: 'gray',
                };
            default:
                return {
                    textColor: '',
                    borderColor: '',
                    bgColor: '',
                    darkTextColor: '',
                    darkBorderColor: '',
                    darkBgColor: '',
                    buttonBg: 'gray',
                };
        }
    };

    const { textColor, borderColor, bgColor, darkTextColor, darkBorderColor, darkBgColor, buttonBg } = getColorClasses();

    const handleButtonClick = (buttonOnClick: () => void) => {
        buttonOnClick();
        setVisible(false);
        onDismiss();
    };

    return (
        <div className="fixed inset-0 flex top-8 justify-center z-50">
            <div
                className={`w-full max-w-lg h-fit p-4 mb-4 border-2 rounded-lg shadow-lg ${textColor} ${borderColor} ${bgColor} ${darkTextColor} ${darkBorderColor} ${darkBgColor}`}
                role="alert"
            >
                <div className="flex items-center">
                    <h3 className="text-lg font-medium">{title}</h3>
                    {autoDismiss && <span className="ml-auto text-sm">{timeLeft}s</span>}
                </div>
                <div className="mt-2 mb-4 text-sm">{message}</div>
                <div className="flex justify-end gap-2">
                    {buttons.map((button, index) => (
                        <button
                            key={index}
                            onClick={() => handleButtonClick(button.onClick)}
                            className={`text-${textColor} border ${borderColor} ${darkBorderColor} hover:${borderColor} bg-${buttonBg}-800 hover:bg-${buttonBg}-900 focus:ring-4 focus:outline-none focus:ring-${buttonBg}-200 font-medium rounded-lg text-xs px-3 py-1.5`}
                        >
                            {button.label}
                        </button>
                    ))}
                    <button
                        type="button"
                        onClick={() => {
                            setVisible(false);
                            onDismiss();
                        }}
                        className={`text-${textColor} border ${borderColor} ${darkBorderColor} hover:bg-${buttonBg}-900 focus:ring-4 focus:outline-none focus:ring-${buttonBg}-200 font-medium rounded-lg text-xs px-3 py-1.5`}
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Alert;
