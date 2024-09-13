import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface ThemeContextType {
    theme: string;
    toggleTheme: (theme: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState('system'); // Default value should be consistent with server rendering
    const [mounted, setMounted] = useState(false); // To ensure consistent hydration

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedTheme = localStorage.getItem('theme') || 'system';
            setTheme(storedTheme);
            applyTheme(storedTheme);
        }
        setMounted(true);
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
            document.documentElement.classList.add('light');
        }
    };

    const toggleTheme = (selectedTheme: string) => {
        setTheme(selectedTheme);
        if (typeof window !== 'undefined') {
            localStorage.setItem('theme', selectedTheme);
            applyTheme(selectedTheme);
        }
    };

    if (!mounted) return null;

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
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
