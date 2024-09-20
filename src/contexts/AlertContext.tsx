import React, {createContext, FC, ReactNode, useCallback, useContext, useEffect, useState} from "react";
import Alert from "@/components/common/Alert";
import {useTranslation} from "@/utils/useTranslation";

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
    const text = useTranslation();

    useEffect(() => {
        if (alerts.length > 0 && !currentAlert) {
            setCurrentAlert(alerts[0]);
            setAlerts((prev) => prev.slice(1));
        }
    }, [alerts, currentAlert]);

    useEffect(() => {
        if (currentAlert && currentAlert.autoDismiss) {
            const timer = setTimeout(() => {
                handleDismiss();
            }, 3000);

            return () => clearTimeout(timer);
        }
    },);

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
                {id: Date.now().toString(), type, title, message, autoDismiss, onAccept, onDismiss},
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
        <AlertContext.Provider value={{success, info, warning, danger, dark}}>
            {currentAlert && (
                <Alert
                    type={currentAlert.type}
                    title={currentAlert.title}
                    message={currentAlert.message}
                    onDismiss={handleDismiss}
                    buttons={
                        currentAlert.onAccept
                            ? [{label: text('content:alert:confirm'), onClick: currentAlert.onAccept}]
                            : []
                    }
                />
            )}
            {children}
        </AlertContext.Provider>
    );
};

export default AlertProvider;
