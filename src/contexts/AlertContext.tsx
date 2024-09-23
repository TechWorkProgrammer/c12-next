import React, { createContext, FC, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { useTranslation } from "@/utils/useTranslation";

type AlertType = "info" | "danger" | "success" | "warning" | "dark";

interface AlertItem {
    id: string;
    type: AlertType;
    title: string;
    message: string;
    autoDismiss: boolean;
    onAccept?: () => void;
    onDismiss?: () => void;
}

interface AlertContextType {
    success: (
        message: string,
        autoDismiss?: boolean,
        onAccept?: () => void,
        onDismiss?: () => void
    ) => void;
    info: (
        message: string,
        autoDismiss?: boolean,
        onAccept?: () => void,
        onDismiss?: () => void
    ) => void;
    warning: (
        message: string,
        autoDismiss?: boolean,
        onAccept?: () => void,
        onDismiss?: () => void
    ) => void;
    danger: (
        message: string,
        autoDismiss?: boolean,
        onAccept?: () => void,
        onDismiss?: () => void
    ) => void;
    dark: (
        message: string,
        autoDismiss?: boolean,
        onAccept?: () => void,
        onDismiss?: () => void
    ) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error("useAlert must be used within an AlertProvider");
    }
    return context;
};

interface AlertProviderProps {
    children: ReactNode;
}

const alertColors = {
    info: "blue",
    danger: "red",
    success: "green",
    warning: "yellow",
    dark: "gray",
};

const AlertProvider: FC<AlertProviderProps> = ({ children }) => {
    const [alerts, setAlerts] = useState<AlertItem[]>([]);
    const [currentAlert, setCurrentAlert] = useState<AlertItem | null>(null);
    const [countdown, setCountdown] = useState<number>(3);
    const [color, setColor] = useState<string>("blue");
    const text = useTranslation();

    useEffect(() => {
        if (alerts.length > 0 && !currentAlert) {
            setCurrentAlert(alerts[0]);
            setAlerts((prev) => prev.slice(1));
        }
    }, [alerts, currentAlert]);

    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;
        if (currentAlert) {
            const alertColor = alertColors[currentAlert.type];
            setColor(alertColor);

            if (currentAlert.autoDismiss) {
                setCountdown(3);
                timer = setInterval(() => {
                    setCountdown((prev) => {
                        if (prev > 1) {
                            return prev - 1;
                        } else {
                            clearInterval(timer as NodeJS.Timeout);
                            if (currentAlert?.onDismiss) {
                                currentAlert.onDismiss();
                            }
                            setCurrentAlert(null);
                            return 0;
                        }
                    });
                }, 1000);
            }
        }

        return () => {
            if (timer) clearInterval(timer);
        };
    }, [currentAlert]);

    const showAlert = useCallback(
        (
            type: AlertType,
            title: string,
            message: string,
            autoDismiss = true,
            onAccept?: () => void,
            onDismiss?: () => void
        ) => {
            setAlerts((prev) => [
                ...prev,
                {
                    id: Date.now().toString(),
                    type,
                    title,
                    message,
                    autoDismiss,
                    onAccept,
                    onDismiss,
                },
            ]);
        },
        []
    );

    const success = useCallback(
        (message: string, autoDismiss = true, onAccept?: () => void, onDismiss?: () => void) =>
            showAlert("success", text('success'), message, autoDismiss, onAccept, onDismiss),
        [showAlert, text]
    );

    const info = useCallback(
        (message: string, autoDismiss = true, onAccept?: () => void, onDismiss?: () => void) =>
            showAlert("info", text('info'), message, autoDismiss, onAccept, onDismiss),
        [showAlert, text]
    );

    const warning = useCallback(
        (message: string, autoDismiss = true, onAccept?: () => void, onDismiss?: () => void) =>
            showAlert("warning", text('warning'), message, autoDismiss, onAccept, onDismiss),
        [showAlert, text]
    );

    const danger = useCallback(
        (message: string, autoDismiss = true, onAccept?: () => void, onDismiss?: () => void) =>
            showAlert("danger", text('danger'), message, autoDismiss, onAccept, onDismiss),
        [showAlert, text]
    );

    const dark = useCallback(
        (message: string, autoDismiss = true, onAccept?: () => void, onDismiss?: () => void) =>
            showAlert("dark", text('dark'), message, autoDismiss, onAccept, onDismiss),
        [showAlert, text]
    );

    const handleDismiss = () => {
        if (currentAlert?.onDismiss) {
            currentAlert.onDismiss();
        }
        setCurrentAlert(null);
    };

    return (
        <AlertContext.Provider value={{ success, info, warning, danger, dark }}>
            {currentAlert && (
                <div className="fixed bg-gray-800 inset-0 bg-opacity-80 flex justify-center z-50">
                    <div
                        className={`w-full max-w-lg h-fit p-4 my-auto mx-4 border border-${color}-300 rounded-lg bg-${color}-50 dark:bg-gray-800 dark:border-${color}-800`}
                        role="alert"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <svg
                                    className={`flex-shrink-0 w-4 h-4 me-2 text-${color}-800 dark:text-${color}-400`}
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                                </svg>
                                <h3 className={`text-lg font-medium text-${color}-800 dark:text-${color}-400`}>
                                    {currentAlert.title}
                                </h3>
                            </div>
                            {currentAlert.autoDismiss && (
                                <span className={`text-xs text-${color}-800 dark:text-${color}-400`}>{countdown}</span>
                            )}
                        </div>
                        <div className={`mt-2 mb-4 text-sm text-${color}-800 dark:text-${color}-400`}>
                            {currentAlert.message}
                        </div>
                        <div className="flex justify-end">
                            {currentAlert.onAccept && (
                                <button
                                    className={`text-white bg-${color}-800 hover:bg-${color}-900 focus:ring-4 focus:outline-none font-medium rounded-lg text-xs px-3 py-1.5 me-2`}
                                    onClick={currentAlert.onAccept}
                                >
                                    {text('content:alert:confirm')}
                                </button>
                            )}
                            <button
                                className={`text-${color}-800 bg-transparent border border-${color}-800 hover:bg-${color}-900 hover:text-${color}-900 focus:ring-4 focus:outline-none font-medium rounded-lg text-xs px-3 py-1.5 dark:hover:bg-${color}-600 dark:text-${color}-400 dark:border-${color}-600 dark:hover:text-white`}
                                onClick={handleDismiss}
                            >
                                {text('close')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {children}
        </AlertContext.Provider>
    );
};

export default AlertProvider;
