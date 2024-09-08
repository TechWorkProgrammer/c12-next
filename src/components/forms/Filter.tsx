import React, {useState} from 'react';

interface FilterIconProps {
    onSelect: (value: string) => void;
}

const Filter: React.FC<FilterIconProps> = ({onSelect}) => {
    const [isOpen, setIsOpen] = useState(false);

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
                <svg
                    className="w-6 h-6 text-gray-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeWidth="2"
                        d="M18.796 4H5.204a1 1 0 0 0-.753 1.659l5.302 6.058a1 1 0 0 1 .247.659v4.874a.5.5 0 0 0 .2.4l3 2.25a.5.5 0 0 0 .8-.4v-7.124a1 1 0 0 1 .247-.659l5.302-6.059c.566-.646.106-1.658-.753-1.658Z"
                    />
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
                            Default
                        </li>
                        <li
                            onClick={() => handleSelect('name-asc')}
                            className="block px-2 py-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            Dari Nama A ke Z
                        </li>
                        <li
                            onClick={() => handleSelect('name-desc')}
                            className="block px-2 py-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            Dari Nama Z ke A
                        </li>
                        <li
                            onClick={() => handleSelect('date-asc')}
                            className="block px-2 py-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            Dari yang terlama
                        </li>
                        <li
                            onClick={() => handleSelect('date-desc')}
                            className="block px-2 py-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            Dari yang terbaru
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Filter;
