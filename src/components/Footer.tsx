import React from "react";
import Image from "next/image";

const Footer: React.FC = () => {
    return (
        <footer className="p-4 w-full border-t-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div
                className="max-w-screen-xl mt-4 mx-auto flex flex-col items-center text-center space-y-3 md:space-y-4 lg:space-y-6">
                <a
                    href="https://techwork.store"
                    className="flex flex-col gap-4 items-center space-x-2 text-xl font-semibold text-gray-700 dark:text-gray-300 md:text-2xl lg:text-3xl"
                >
                    <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200 dark:border-gray-500">
                        <Image
                            src="/default.png"
                            alt="Logo Akmil Office"
                            width={1280}
                            height={728}
                            className="w-56 h-auto"
                            loading="eager"
                        />
                    </div>
                    <span>SPARTI</span>
                </a>
                <p className="text-gray-500 lg:px-16 dark:text-gray-400 text-xs md:text-sm lg:text-base xl:text-lg">
                    Solusi pengarsipan digital unggulan dalam pengelolaan dokumen militer yang aman, efisien, dan
                    terintegrasi
                </p>
                <span className="text-xs text-gray-500 dark:text-gray-400 md:text-sm lg:text-base">
                    © 2024 Akmil Office™. All Rights Reserved.
                </span>
            </div>
        </footer>
    );
};

export default Footer;
