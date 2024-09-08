import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Sidebar from '@/components/Sidebar';
import { useTheme } from '@/contexts/ThemeContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { theme } = useTheme();

    useEffect(() => {
        document.body.classList.add('bg-gray-50', 'dark:bg-gray-900');
    }, [theme]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex flex-col min-h-screen w-full overflow-hidden">
            <Header toggleSidebar={toggleSidebar} />
            <div className="flex flex-grow">
                <Sidebar isOpen={isSidebarOpen} />
                <div className={`flex-grow transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
                    <main className="pt-20 px-4 lg:px-6 pb-8">{children}</main>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Layout;
