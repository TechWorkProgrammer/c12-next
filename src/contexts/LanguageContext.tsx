import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface LanguageContextType {
    language: string;
    toggleLanguage: (language: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<string>('id');

    useEffect(() => {
        const userLang = navigator.language || 'id';
        const storedLanguage = localStorage.getItem('language') || userLang.split('-')[0];
        setLanguage(storedLanguage);
    }, []);

    const toggleLanguage = (selectedLanguage: string) => {
        setLanguage(selectedLanguage);
        localStorage.setItem('language', selectedLanguage);
    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

export default LanguageProvider;
