import React from 'react';
import {useTheme} from '@/contexts/ThemeContext';
import {useLanguage} from '@/contexts/LanguageContext';
import Select from '@/components/forms/Select';
import {useTranslation} from '@/utils/useTranslation';
import {getCurrentUser} from "@/storage/auth";

const Settings: React.FC = () => {
    const {theme, toggleTheme, sidebarPosition, toggleSidebarPosition, fontFamily, toggleFontFamily} = useTheme();
    const {language, toggleLanguage} = useLanguage();
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
        {label: 'Bahasa Indonesia (Beta)', value: 'id'},
        {label: 'Basa Jawa (Beta)', value: 'jv'}
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
                    </fieldset>
                </div>
            )}
        </>
    );
};

export default Settings;
