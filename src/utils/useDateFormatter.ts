import {useLanguage} from '@/contexts/LanguageContext';

export const useDateFormatter = () => {
    const { language } = useLanguage();
    const locale = language === 'en' ? 'en-US' : 'id-ID';

    return (date: Date | string | undefined | null): string => {
        if (!date) {
            return language === 'en' ? 'Date not found' : 'Tanggal tidak ditemukan';
        }

        const dateObj = typeof date === 'string' ? new Date(date) : date;

        if (isNaN(dateObj.getTime())) {
            return language === 'en' ? 'Invalid Date' : 'Tanggal tidak valid';
        }

        const isTimeIncluded = typeof date === 'string' && /\d{2}:\d{2}:\d{2}/.test(date);
        const options: Intl.DateTimeFormatOptions = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };

        if (isTimeIncluded) {
            options.hour = '2-digit';
            options.minute = '2-digit';
        }

        return new Intl.DateTimeFormat(locale, options).format(dateObj);
    };
};
