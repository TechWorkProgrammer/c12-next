import Config from 'tailwindcss';

const config: Config = {
    darkMode: 'class',
    content: [
        './src/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                nunito: ['Nunito', 'sans-serif'],
                merriweather: ['Merriweather', 'serif'],
                roboto: ['Roboto', 'sans-serif'],
                arial: ['Arial', 'sans-serif'],
                helvetica: ['Helvetica', 'Arial', 'sans-serif'],
                openSans: ['Open Sans', 'sans-serif'],
                lato: ['Lato', 'sans-serif'],
                calibri: ['Calibri', 'sans-serif'],
                verdana: ['Verdana', 'sans-serif'],
                timesNewRoman: ['Times New Roman', 'serif'],
            }
        },
    },
    plugins: [],
};

export default config;
