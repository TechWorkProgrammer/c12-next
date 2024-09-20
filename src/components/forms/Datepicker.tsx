import React from 'react';
import {useTheme} from "@/contexts/ThemeContext";

interface DateInputProps {
    label?: string;
    selectedDate?: string | null;
    onChange: (selectedDate: string) => void;
}

const Datepicker: React.FC<DateInputProps> = ({label = null, selectedDate = '', onChange}) => {
    const {theme} = useTheme();
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const date = e.target.value;
        onChange(date);
    };

    return (
        <fieldset className="w-full border border-gray-300 rounded-lg dark:border-gray-600">
            <legend className="mx-2 px-1 text-sm font-bold text-gray-500 dark:text-gray-400">
                {label ? label : 'Input Date'}
            </legend>
            <div className="relative">
                <input
                    type="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    className="bg-inherit text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-3 pt-1 pb-2 outline-none dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    style={{
                        colorScheme: theme === 'dark' ? 'dark' : 'light',
                    }}
                />
            </div>
        </fieldset>
    );
};

export default Datepicker;
