import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Sidebar from '@/components/Sidebar';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex flex-col min-h-screen w-full overflow-hidden">
            <Header toggleSidebar={toggleSidebar} />
            <div className="flex flex-grow">
                <Sidebar isOpen={isSidebarOpen} />
                <div className={`flex-grow transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
                    <main className="pt-20 pb-8 px-4 lg:pt-24 lg:px-6 lg:pb-12">{children}</main>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Layout;
