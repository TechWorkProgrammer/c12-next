import React, {createContext, FC, ReactNode, useCallback, useContext, useEffect, useState,} from "react";
import Alert from "@/components/common/Alert";

type AlertType = "info" | "danger" | "success" | "warning" | "dark";

interface AlertItem {
    id: string;
    type: AlertType;
    title: string;
    message: string;
    autoDismiss: boolean;
    onAccept?: () => void;
}

interface AlertContextType {
    success: (
        message: string,
        autoDismiss?: boolean,
        onAccept?: () => void
    ) => void;
    info: (message: string, autoDismiss?: boolean, onAccept?: () => void) => void;
    warning: (
        message: string,
        autoDismiss?: boolean,
        onAccept?: () => void
    ) => void;
    danger: (
        message: string,
        autoDismiss?: boolean,
        onAccept?: () => void
    ) => void;
    dark: (message: string, autoDismiss?: boolean, onAccept?: () => void) => void;
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

    useEffect(() => {
        if (alerts.length > 0 && !currentAlert) {
            setCurrentAlert(alerts[0]);
            setAlerts((prev) => prev.slice(1));
        }
    }, [alerts, currentAlert]);

    const addAlert = useCallback(
        (
            type: AlertType,
            title: string,
            message: string,
            autoDismiss = true,
            onAccept?: () => void
        ) => {
            setAlerts((prev) => [
                ...prev,
                {id: Date.now().toString(), type, title, message, autoDismiss, onAccept},
            ]);
        },
        []
    );

    const success = useCallback(
        (message: string, autoDismiss = true, onAccept?: () => void) =>
            addAlert("success", "Success", message, autoDismiss, onAccept),
        [addAlert]
    );

    const info = useCallback(
        (message: string, autoDismiss = true, onAccept?: () => void) =>
            addAlert("info", "Info", message, autoDismiss, onAccept),
        [addAlert]
    );

    const warning = useCallback(
        (message: string, autoDismiss = true, onAccept?: () => void) =>
            addAlert("warning", "Peringatan", message, autoDismiss, onAccept),
        [addAlert]
    );

    const danger = useCallback(
        (message: string, autoDismiss = true, onAccept?: () => void) =>
            addAlert("danger", "Error", message, autoDismiss, onAccept),
        [addAlert]
    );

    const dark = useCallback(
        (message: string, autoDismiss = true, onAccept?: () => void) =>
            addAlert("dark", "Info", message, autoDismiss, onAccept),
        [addAlert]
    );

    const handleDismiss = () => {
        setCurrentAlert(null);
    };

    return (
        <AlertContext.Provider value={{success, info, warning, danger, dark}}>
            {children}
            {currentAlert && (
                <Alert
                    type={currentAlert.type}
                    title={currentAlert.title}
                    message={currentAlert.message}
                    autoDismiss={currentAlert.autoDismiss}
                    onDismiss={handleDismiss}
                    buttons={
                        currentAlert.onAccept
                            ? [{label: "Ya, saya yakin", onClick: currentAlert.onAccept}]
                            : []
                    }
                />
            )}
        </AlertContext.Provider>
    );
};

export default AlertProvider;
