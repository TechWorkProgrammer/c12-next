import React, {FC, useState} from 'react';
import Input from "@/components/forms/Input";
import {useTranslation} from "@/utils/useTranslation";

interface Option {
    label: string;
    value: string;
    style?: string | null;
}

interface SelectProps {
    label?: string | null;
    value: string;
    options: Option[];
    defaultValue?: string;
    onChange: (value: string) => void;
}

const Select: FC<SelectProps> = ({label = null, value, options, defaultValue, onChange}) => {
    const [selectedValue, setSelectedValue] = useState(value || defaultValue || '');
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const text = useTranslation();

    const handleToggle = () => {
        setIsOpen((prev) => !prev);
    };

    const handleSelect = (optionValue: string) => {
        setSelectedValue(optionValue);
        onChange(optionValue);
        setIsOpen(false);
    };

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value.toLowerCase());
    };

    const filteredOptions = options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm)
    );

    const displayOptions = options.length > 10
        ? [...filteredOptions.slice(0, 3), {label: '...', value: ''}]
        : filteredOptions;

    return (
        <div className="relative w-full">
            <fieldset className="border border-gray-300 rounded-lg dark:border-gray-600">
                <legend className="mx-2 px-1 text-sm font-bold text-gray-500 dark:text-gray-400">
                    {label ? label : 'Select'}
                </legend>
                <div className="relative">
                    <button
                        onClick={handleToggle}
                        className="bg-inherit text-gray-900 text-sm rounded-lg w-full px-3 pt-0.5 pb-2 dark:text-white dark:placeholder-gray-400 appearance-none outline-none flex justify-between items-center"
                    >
                        {options.find((option) => option.value === selectedValue)?.label || 'Select'}
                        <span className="pointer-events-none">
                            {isOpen ? (
                                <svg
                                    className="w-6 h-6 text-gray-700 dark:text-white"
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
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m5 15 7-7 7 7"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    className="w-6 h-6 text-gray-700 dark:text-white"
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
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m19 9-7 7-7-7"
                                    />
                                </svg>
                            )}
                        </span>
                    </button>
                </div>
            </fieldset>
            {isOpen && (
                <div
                    className="absolute right-0 mt-2 w-full bg-white border border-gray-300 rounded-lg dark:border-gray-600 py-2 shadow-lg z-10 dark:bg-gray-800">
                    {options.length > 10 && (
                        <div className="px-2 py-1">
                            <Input
                                label={text('search')}
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                        </div>
                    )}
                    <ul className="text-sm text-gray-700 dark:text-gray-200 divide-y divide-gray-200 dark:divide-gray-700">
                        {displayOptions.map((option) => (
                            <li
                                key={option.value}
                                onClick={() => handleSelect(option.value)}
                                className={`block px-2 py-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 ${"style" in option ? option.style : ''} !important`}
                            >
                                {option.label}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Select;
