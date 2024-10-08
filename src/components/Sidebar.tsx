import React from 'react';
import Link from "next/link";
import {getCurrentUser, logoutUser} from '@/storage/auth';
import {useAlert} from "@/contexts/AlertContext";
import {useLoader} from "@/contexts/LoadingContext";
import {useTheme} from "@/contexts/ThemeContext";
import {useTranslation} from "@/utils/useTranslation";

interface SidebarProps {
    isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({isOpen}) => {
    const {sidebarPosition} = useTheme();
    const user = getCurrentUser();
    const alert = useAlert();
    const setLoading = useLoader();
    const text = useTranslation();

    const handleLogout = () => {
        alert.warning(
            text('message:logout_confirmation'),
            false,
            () => {
                executeLogout().then();
            }
        );
    };

    const executeLogout = async () => {
        setLoading(true);
        try {
            await logoutUser();
            alert.success(text('message:logout_success'), false);
        } catch (error: any) {
            alert.danger(error.message || text('message:logout_failed'), false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <aside
            className={`fixed top-[3rem] ${
                sidebarPosition === 'left' ? 'left-0' : 'right-0'
            } z-20 w-64 h-screen transition-transform transform ${
                isOpen ? 'translate-x-0' : sidebarPosition === 'left' ? '-translate-x-full' : 'translate-x-full'
            } bg-white dark:bg-gray-800 border-x border-gray-200 dark:border-gray-700`}
        >
            <div className="overflow-y-auto py-5 px-3 h-fit">
                {user && (
                    <ul className="pt-5 space-y-2 flex flex-col items-center justify-between border-t mt-2 border-gray-200 dark:border-gray-700">
                        <li className="text-base font-semibold text-gray-900 dark:text-white">{user.name}</li>
                        <li className="text-sm text-gray-600 dark:text-gray-400">{user.email}</li>
                        {user.role === "Pejabat" && user.pejabat ? (
                            <li className="text-sm text-gray-600 dark:text-gray-400">{user.pejabat.name}</li>
                        ) : (
                            <li className="text-sm text-gray-600 dark:text-gray-400">{user.role}</li>
                        )}
                    </ul>
                )}

                <ul className="pt-5 py-5 space-y-2 border-y mt-4 border-gray-200 dark:border-gray-700">
                    <li>
                        <Link
                            href="/"
                            className="flex items-center p-2 text-base font-normal text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                        >
                            <svg
                                className="w-6 h-6 text-gray-400 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5"
                                />
                            </svg>
                            <span
                                className="ml-3 text-gray-900 dark:text-white group-hover:text-gray-900 dark:group-hover:text-white">{text('dashboard')}</span>
                        </Link>
                    </li>
                    {user && user.role !== "Administrator" && (
                        <>
                            {user.role !== "External" && (
                                <li>
                                    <Link
                                        href="/letters/in"
                                        className="flex items-center p-2 text-base font-normal text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                    >
                                        <svg
                                            className="w-6 h-6 text-gray-400 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M5 12V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-4m5-13v4a1 1 0 0 1-1 1H5m0 6h9m0 0-2-2m2 2-2 2"
                                            />
                                        </svg>
                                        <span
                                            className="ml-3 text-gray-900 dark:text-white group-hover:text-gray-900 dark:group-hover:text-white">
                                            {text('letters_in')}
                                        </span>
                                    </Link>
                                </li>
                            )}
                            <li>
                                <Link
                                    href="/letters/out"
                                    className="flex items-center p-2 text-base font-normal text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                >
                                    <svg
                                        className="w-6 h-6 text-gray-400 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M19 10V4a1 1 0 0 0-1-1H9.914a1 1 0 0 0-.707.293L5.293 7.207A1 1 0 0 0 5 7.914V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2M10 3v4a1 1 0 0 1-1 1H5m5 6h9m0 0-2-2m2 2-2 2"
                                        />
                                    </svg>
                                    <span
                                        className="ml-3 text-gray-900 dark:text-white group-hover:text-gray-900 dark:group-hover:text-white">
                                        {text('letters_out')}
                                    </span>
                                </Link>
                            </li>
                        </>
                    )}
                    {user && user.role === "Administrator" && (
                        <li>
                            <Link
                                href="/management"
                                className="flex items-center p-2 text-base font-normal text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                            >
                                <svg
                                    className="w-6 h-6 text-gray-400 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                    viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M19 6c0 1.657-3.134 3-7 3S5 7.657 5 6m14 0c0-1.657-3.134-3-7-3S5 4.343 5 6m14 0v6M5 6v6m0 0c0 1.657 3.134 3 7 3s7-1.343 7-3M5 12v6c0 1.657 3.134 3 7 3s7-1.343 7-3v-6"/>
                                </svg>
                                <span
                                    className="ml-3 text-gray-900 dark:text-white group-hover:text-gray-900 dark:group-hover:text-white">
                                    {text('management')}
                                </span>
                            </Link>
                        </li>
                    )}
                    {/*{user && (
                        <li>
                            <Link
                                href="/qr"
                                className="flex items-center p-2 text-base font-normal text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                            >
                                <svg
                                    className="w-6 h-6 text-gray-400 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path stroke="currentColor" strokeLinejoin="round" strokeWidth="2"
                                          d="M4 4h6v6H4V4Zm10 10h6v6h-6v-6Zm0-10h6v6h-6V4Zm-4 10h.01v.01H10V14Zm0 4h.01v.01H10V18Zm-3 2h.01v.01H7V20Zm0-4h.01v.01H7V16Zm-3 2h.01v.01H4V18Zm0-4h.01v.01H4V14Z"/>
                                    <path stroke="currentColor" strokeLinejoin="round" strokeWidth="2"
                                          d="M7 7h.01v.01H7V7Zm10 10h.01v.01H17V17Z"/>
                                </svg>

                                <span
                                    className="ml-3 text-gray-900 dark:text-white group-hover:text-gray-900 dark:group-hover:text-white">
                                    {text('qr_generator')}
                                </span>
                            </Link>
                        </li>
                    )}*/}
                </ul>

                <ul className="pt-5 space-y-2">
                    {user ? (
                        <li>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center p-2 text-base font-normal text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                            >
                                <svg
                                    className="w-6 h-6 text-gray-400 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M20 12H8m12 0-4 4m4-4-4-4M9 4H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h2"
                                    />
                                </svg>
                                <span
                                    className="ml-3 text-gray-900 dark:text-white group-hover:text-gray-900 dark:group-hover:text-white">
                                    {text('logout')}
                                </span>
                            </button>
                        </li>
                    ) : (
                        <li>
                            <Link
                                href="/login"
                                className="flex items-center p-2 text-base font-normal text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                            >
                                <svg
                                    className="w-6 h-6 text-gray-400 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M16 12H4m12 0-4 4m4-4-4-4m3-4h2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-2"
                                    />
                                </svg>
                                <span
                                    className="ml-3 text-gray-900 dark:text-white group-hover:text-gray-900 dark:group-hover:text-white">
                                    {text('login')}
                                </span>
                            </Link>
                        </li>
                    )}
                    <li>
                        <Link
                            href="/settings"
                            className="flex items-center p-2 text-base font-normal text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                        >
                            <svg
                                className="w-6 h-6 text-gray-400 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M21 13v-2a1 1 0 0 0-1-1h-.757l-.707-1.707.535-.536a1 1 0 0 0 0-1.414l-1.414-1.414a1 1 0 0 0-1.414 0l-.536.535L14 4.757V4a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v.757l-1.707.707-.536-.535a1 1 0 0 0-1.414 0L4.929 6.343a1 1 0 0 0 0 1.414l.536.536L4.757 10H4a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h.757l.707 1.707-.535.536a1 1 0 0 0 0 1.414l1.414 1.414a1 1 0 0 0 1.414 0l.536-.535 1.707.707V20a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-.757l1.707-.708.536.536a1 1 0 0 0 1.414 0l1.414-1.414a1 1 0 0 0 0-1.414l-.535-.536.707-1.707H20a1 1 0 0 0 1-1Z"
                                />
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                                />
                            </svg>
                            <span
                                className="ml-3 text-gray-900 dark:text-white group-hover:text-gray-900 dark:group-hover:text-white">
                                {text('settings')}
                            </span>
                        </Link>
                    </li>
                </ul>
            </div>
        </aside>
    );
};

export default Sidebar;
