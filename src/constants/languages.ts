import { LanguageType } from '@app/interfaces/interfaces';

interface Language {
    id: number;
    name: LanguageType;
    title: string;
    countryCode: string;
}

export const languages: Language[] = [
    {
        id: 1,
        name: 'en',
        title: 'English',
        countryCode: 'gb',
    },
    {
        id: 2,
        name: 'de',
        title: 'German',
        countryCode: 'de',
    },
    {
        id: 3,
        name: 'ar',
        title: 'Arabic',
        countryCode: 'ar',
    },
    {
        id: 4,
        name: 'fr',
        title: 'French',
        countryCode: 'FR',
    },
];
