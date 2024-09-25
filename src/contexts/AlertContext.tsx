import React, {createContext, FC, ReactNode, useCallback, useContext, useEffect, useState} from "react";
import {useTranslation} from "@/utils/useTranslation";
import {DangerAlert, DarkAlert, InfoAlert, SuccessALert, WarningAlert} from "@/components/alerts/ALert";

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

const AlertProvider: FC<AlertProviderProps> = ({children}) => {
    const [alerts, setAlerts] = useState<AlertItem[]>([]);
    const [currentAlert, setCurrentAlert] = useState<AlertItem | null>(null);
    const [countdown, setCountdown] = useState<number>(0);
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

    const handleAccept = () => {
        if (currentAlert?.onAccept) {
            currentAlert?.onAccept();
        }
        if (currentAlert?.onDismiss) {
            currentAlert.onDismiss();
        }
        setCurrentAlert(null);
        setCountdown(0);
    };

    const handleDismiss = () => {
        if (currentAlert?.onDismiss) {
            currentAlert.onDismiss();
        }
        setCurrentAlert(null);
        setCountdown(0);
    };

    return (
        <AlertContext.Provider value={{success, info, warning, danger, dark}}>
            {currentAlert && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex justify-center items-center z-50">
                    {currentAlert.type === 'success' && (
                        <SuccessALert {...currentAlert} countdown={countdown} onDismiss={handleDismiss}
                                      onAccept={handleAccept}/>
                    )}
                    {currentAlert.type === 'warning' && (
                        <WarningAlert {...currentAlert} countdown={countdown} onDismiss={handleDismiss}
                                      onAccept={handleAccept}/>
                    )}
                    {currentAlert.type === 'danger' && (
                        <DangerAlert {...currentAlert} countdown={countdown} onDismiss={handleDismiss}
                                     onAccept={handleAccept}/>
                    )}
                    {currentAlert.type === 'info' && (
                        <InfoAlert {...currentAlert} countdown={countdown} onDismiss={handleDismiss}
                                   onAccept={handleAccept}/>
                    )}
                    {currentAlert.type === 'dark' && (
                        <DarkAlert {...currentAlert} countdown={countdown} onDismiss={handleDismiss}
                                   onAccept={handleAccept}/>
                    )}
                </div>
            )}
            {children}
        </AlertContext.Provider>
    );
};

export default AlertProvider;
