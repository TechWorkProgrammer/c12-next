import React, {useState} from 'react';
import {useTranslation} from "@/utils/useTranslation";

interface FilterIconProps {
    onSelect: (value: string) => void;
}

const Filter: React.FC<FilterIconProps> = ({onSelect}) => {
    const [isOpen, setIsOpen] = useState(false);
    const text = useTranslation();

    const handleToggle = () => {
        setIsOpen((prev) => !prev);
    };

    const handleSelect = (value: string) => {
        onSelect(value);
        setIsOpen(false);
    };

    return (
        <div
            className="relative w-fit h-fit border border-gray-300 rounded-lg dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none">
            <button
                onClick={handleToggle}
                className="p-2.5"
            >
                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                     xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M7 4v16M7 4l3 3M7 4 4 7m9-3h6l-6 6h6m-6.5 10 3.5-7 3.5 7M14 18h4"/>
                </svg>

            </button>

            {isOpen && (
                <div
                    className="absolute right-0 mt-2 w-36 bg-white border border-gray-300 rounded-lg dark:border-gray-600 py-2 shadow-lg z-10 dark:bg-gray-800">
                    <ul className="text-sm text-gray-700 dark:text-gray-200 divide-y divide-gray-200 dark:divide-gray-700">
                        <li
                            onClick={() => handleSelect('default')}
                            className="block px-2 py-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            {text('content:filter:default')}
                        </li>
                        <li
                            onClick={() => handleSelect('name-asc')}
                            className="block px-2 py-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            {text('content:filter:a_to_z')}
                        </li>
                        <li
                            onClick={() => handleSelect('name-desc')}
                            className="block px-2 py-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            {text('content:filter:z_to_a')}
                        </li>
                        <li
                            onClick={() => handleSelect('date-desc')}
                            className="block px-2 py-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            {text('content:filter:newest')}
                        </li>
                        <li
                            onClick={() => handleSelect('date-asc')}
                            className="block px-2 py-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            {text('content:filter:oldest')}
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Filter;
