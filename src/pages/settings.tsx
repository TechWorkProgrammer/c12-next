import React, {useState} from 'react';
import {useTheme} from '@/contexts/ThemeContext';
import {useLanguage} from '@/contexts/LanguageContext';
import Select from '@/components/forms/Select';
import {useTranslation} from '@/utils/useTranslation';
import {getCurrentUser} from "@/storage/auth";
import GenerateLogPDF from "@/components/common/GenerateLogPDF";

const Settings: React.FC = () => {
    const {theme, toggleTheme, sidebarPosition, toggleSidebarPosition, fontFamily, toggleFontFamily} = useTheme();
    const {language, toggleLanguage} = useLanguage();
    const [selectedMonth, setSelectedMonth] = useState<string>(String(new Date().getMonth() + 1));
    const [selectedYear, setSelectedYear] = useState<string>(String(new Date().getFullYear()));
    const user = getCurrentUser();
    const text = useTranslation();

    const themeOptions = [
        {label: text('light'), value: 'light'},
        {label: text('dark'), value: 'dark'},
        {label: text('system'), value: 'system'},
    ];

    const sidebarPositionOptions = [
        {label: text('left'), value: 'left'},
        {label: text('right'), value: 'right'},
    ];

    const languageOptions = [
        {label: 'English', value: 'en'},
        {label: 'Bahasa Indonesia', value: 'id'}
    ];

    const fontOptions = [
        {label: 'Arial', value: 'arial', style: 'font-arial'},
        {label: 'Helvetica', value: 'helvetica', style: 'font-helvetica'},
        {label: 'Lato', value: 'lato', style: 'font-lato'},
        {label: 'Nunito', value: 'nunito', style: 'font-nunito'},
        {label: 'Open Sans', value: 'openSans', style: 'font-openSans'},
        {label: 'Roboto', value: 'roboto', style: 'font-roboto'},
        {label: 'Times New Roman', value: 'timesNewRoman', style: 'font-timesNewRoman'},
        {label: 'Verdana', value: 'verdana', style: 'font-verdana'},
    ];

    const monthOptions = Array.from({length: 12}, (_, i) => ({
        label: text(new Date(0, i).toLocaleString('default', {month: 'long'}).toLowerCase()),
        value: String(i + 1),
    }));

    const yearOptions = Array.from({length: 10}, (_, i) => {
        const year = new Date().getFullYear() - i;
        return {label: year.toString(), value: year.toString()};
    });

    return (
        <>
            <h1 className="text-xl font-semibold text-gray-700 dark:text-gray-300">{text('settings')}</h1>
            <div className="my-4 ">
                <fieldset
                    className="relative w-full border border-gray-300 rounded-lg dark:border-gray-600 p-4 flex flex-col gap-4">
                    <legend className="mx-2 px-1 text-sm font-bold text-gray-500 dark:text-gray-400">
                        {text('appearance')}
                    </legend>
                    <Select
                        label={text('theme')}
                        value={theme}
                        options={themeOptions}
                        onChange={(value) => toggleTheme(value)}
                    />
                    <Select
                        label={text('font_style')}
                        value={fontFamily}
                        options={fontOptions}
                        onChange={(value) => toggleFontFamily(value)}
                    />
                    <Select
                        label={text('sidebar_position')}
                        value={sidebarPosition}
                        options={sidebarPositionOptions}
                        onChange={(value) => toggleSidebarPosition(value as 'left' | 'right')}
                    />
                </fieldset>
            </div>
            <div className="my-4 ">
                <fieldset
                    className="relative w-full border border-gray-300 rounded-lg dark:border-gray-600 p-4 flex flex-col gap-4">
                    <legend className="mx-2 px-1 text-sm font-bold text-gray-500 dark:text-gray-400">
                        {text('language&region')}
                    </legend>
                    <Select
                        label={text('language')}
                        value={language}
                        options={languageOptions}
                        onChange={(value) => toggleLanguage(value)}
                    />
                </fieldset>
            </div>
            {user && (
                <div className="my-4 ">
                    <fieldset
                        className="relative w-full border border-gray-300 rounded-lg dark:border-gray-600 p-4 flex flex-col gap-4">
                        <legend className="mx-2 px-1 text-sm font-bold text-gray-500 dark:text-gray-400">
                            {text('account')}
                        </legend>
                        <div className="flex flex-row gap-2 justify-between items-center">
                            <Select
                                label={text('month')}
                                value={String(selectedMonth)}
                                options={monthOptions}
                                onChange={(value) => setSelectedMonth(value)}
                            />
                            <Select
                                label={text('year')}
                                value={String(selectedYear)}
                                options={yearOptions}
                                onChange={(value) => setSelectedYear(value)}
                            />
                        </div>
                        <div className="flex w-full items-center justify-center">
                            <GenerateLogPDF userName={user.name} userUUID={user.uuid} month={selectedMonth}
                                            year={selectedYear}/>
                        </div>
                    </fieldset>
                </div>
            )}
        </>
    );
};

export default Settings;
