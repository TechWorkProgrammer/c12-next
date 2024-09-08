import React from 'react';
import {useTheme} from '@/contexts/ThemeContext';
import Select from '@/components/forms/Select';

const Settings: React.FC = () => {
    const {theme, toggleTheme} = useTheme();

    const themeOptions = [
        {label: 'Terang', value: 'light'},
        {label: 'Gelap', value: 'dark'},
        {label: 'System', value: 'system'},
    ];

    return (
        <>
            <h1 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Pengaturan</h1>
            <div className="my-4">
                <Select
                    label={'Tema'}
                    value={theme}
                    options={themeOptions}
                    onChange={(value) => toggleTheme(value)}
                />
            </div>
        </>
    );
};

export default Settings;
