import React, { createContext, FC, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import Alert from '@/components/common/Alert';

type AlertType = 'info' | 'danger' | 'success' | 'warning' | 'dark';

interface AlertContextType {
    success: (message: string, autoDismiss?: boolean, onAccept?: () => void) => void;
    info: (message: string, autoDismiss?: boolean, onAccept?: () => void) => void;
    warning: (message: string, autoDismiss?: boolean, onAccept?: () => void) => void;
    danger: (message: string, autoDismiss?: boolean, onAccept?: () => void) => void;
    dark: (message: string, autoDismiss?: boolean, onAccept?: () => void) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error('useAlert must be used within an AlertProvider');
    }
    return context;
};

interface AlertProviderProps {
    children: ReactNode;
}

const AlertProvider: FC<AlertProviderProps> = ({ children }) => {
    const [alerts, setAlerts] = useState<{ id: string; type: AlertType; message: string; autoDismiss: boolean; onAccept?: () => void }[]>([]);
    const [currentAlert, setCurrentAlert] = useState<{ id: string; type: AlertType; message: string; autoDismiss: boolean; onAccept?: () => void } | null>(null);

    useEffect(() => {
        if (alerts.length > 0 && !currentAlert) {
            setCurrentAlert(alerts[0]);
            setAlerts((prev) => prev.slice(1));
        }
    }, [alerts, currentAlert]);

    const addAlert = useCallback((type: AlertType, message: string, autoDismiss = true, onAccept?: () => void) => {
        setAlerts((prev) => [...prev, { id: Date.now().toString(), type, message, autoDismiss, onAccept }]);
    }, []);

    const success = (message: string, autoDismiss = true, onAccept?: () => void) => addAlert('success', message, autoDismiss, onAccept);
    const info = (message: string, autoDismiss = true, onAccept?: () => void) => addAlert('info', message, autoDismiss, onAccept);
    const warning = (message: string, autoDismiss = true, onAccept?: () => void) => addAlert('warning', message, autoDismiss, onAccept);
    const danger = (message: string, autoDismiss = true, onAccept?: () => void) => addAlert('danger', message, autoDismiss, onAccept);
    const dark = (message: string, autoDismiss = true, onAccept?: () => void) => addAlert('dark', message, autoDismiss, onAccept);

    const handleDismiss = () => {
        setCurrentAlert(null);
    };

    return (
        <AlertContext.Provider value={{ success, info, warning, danger, dark }}>
            {children}
            {currentAlert && (
                <Alert
                    type={currentAlert.type}
                    title={currentAlert.type.toUpperCase()}
                    message={currentAlert.message}
                    autoDismiss={currentAlert.autoDismiss}
                    onDismiss={handleDismiss}
                    buttons={currentAlert.onAccept ? [{ label: 'Ya, saya yakin', onClick: currentAlert.onAccept }] : []}
                />
            )}
        </AlertContext.Provider>
    );
};

export default AlertProvider;
