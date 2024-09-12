import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';

interface ThemeContextType {
    theme: string;
    toggleTheme: (theme: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const ThemeProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [theme, setTheme] = useState('system');

    useEffect(() => {
        const storedTheme = localStorage.getItem('theme') || 'system';
        document.body.classList.add('bg-gray-50', 'dark:bg-gray-900');
        setTheme(storedTheme);
        applyTheme(storedTheme);
    }, []);

    const applyTheme = (selectedTheme: string) => {
        if (
            selectedTheme === 'dark' ||
            (selectedTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
        ) {
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light');
        } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.classList.remove('dark');
        }
    };

    const toggleTheme = (selectedTheme: string) => {
        setTheme(selectedTheme);
        localStorage.setItem('theme', selectedTheme);
        applyTheme(selectedTheme);
    };

    return (
        <ThemeContext.Provider value={{theme, toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export default ThemeProvider;
