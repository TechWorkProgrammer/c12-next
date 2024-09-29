import en from '@/data/en.json';
import id from '@/data/id.json';
import {useLanguage} from '@/contexts/LanguageContext';

const translations: any = {en, id};

export const useTranslation = () => {
    const {language} = useLanguage();
    return (key: string): string => {
        if (!isNaN(Number(key))) {
            return key;
        }

        const formattedKey = key.toLowerCase().replace(/\s+/g, '_');
        const keys = formattedKey.split(':');

        let value = translations[language];
        for (const k of keys) {
            if (value && typeof value === 'object') {
                value = value[k];
            } else {
                break;
            }
        }

        return typeof value === 'string' ? value : "key:" + formattedKey;
    }
};
