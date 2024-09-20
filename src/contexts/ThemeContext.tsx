import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface ThemeContextType {
    theme: string;
    toggleTheme: (theme: string) => void;
    sidebarPosition: 'left' | 'right';
    toggleSidebarPosition: (position: string) => void;
    fontFamily: string;
    toggleFontFamily: (font: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState('system');
    const [sidebarPosition, setSidebarPosition] = useState<'left' | 'right'>('left');
    const [fontFamily, setFontFamily] = useState('nunito');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedTheme = localStorage.getItem('theme') || 'system';
            const storedPosition = localStorage.getItem('sidebarPosition') || 'left';
            const storedFontFamily = localStorage.getItem('fontFamily') || 'nunito';
            setTheme(storedTheme);
            setSidebarPosition(storedPosition as 'left' | 'right');
            setFontFamily(storedFontFamily);

            applyFontFamily(storedFontFamily);
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

    const applyFontFamily = (selectedFontFamily: string) => {
        document.documentElement.style.setProperty('--tw-font-family', selectedFontFamily);
    };

    const toggleTheme = (selectedTheme: string) => {
        setTheme(selectedTheme);
        if (typeof window !== 'undefined') {
            localStorage.setItem('theme', selectedTheme);
            applyTheme(selectedTheme);
        }
    };

    const toggleSidebarPosition = (position: 'left' | 'right') => {
        setSidebarPosition(position);
        if (typeof window !== 'undefined') {
            localStorage.setItem('sidebarPosition', position);
        }
    };

    const toggleFontFamily = (font: string) => {
        setFontFamily(font);
        localStorage.setItem('fontFamily', font);
        applyFontFamily(font);
    };

    if (!mounted) return null;

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, sidebarPosition, toggleSidebarPosition, fontFamily, toggleFontFamily }}>
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
