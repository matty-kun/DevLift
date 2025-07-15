/** @type {import('tailwindcss').Config} */
import plugin from 'tailwindcss/plugin';

export default {
    content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: "#EEF2F7",
                    100: '#D4E0ED',
                    200: '#A9C1DB',
                    300: '#7EA2C9',
                    400: '#5383B7',
                    500: '#2864A5',
                    600: '#1D3557', // Main primary
                    700: '#132843',
                    800: '#0A1A2E',
                    900: '#040D1A',
                },
                secondary: {
                    50: '#E6F5F3',
                    100: '#C5E8E4',
                    200: '#8AD0C9',
                    300: '#50B8AE',
                    400: '#2A9D8F', // Main secondary
                    500: '#217F74',
                    600: '#18615A',
                    700: '#10443F',
                    800: '#082725',
                    900: '#04100F',
                },
                accent: {
                    50: '#FDF2EE',
                    100: '#FADBD2',
                    200: '#F5B7A5',
                    300: '#F09378',
                    400: '#EB6F4B',
                    500: '#E76F51', // Main accent
                    600: '#B84B33',
                    700: '#8A3826',
                    800: '#5C2518',
                    900: '#2E120C',
                },
                success: {
                    50: '#E8F5E9',
                    100: '#C8E6C9',
                    200: '#A5D6A7',
                    300: '#81C784',
                    400: '#66BB6A',
                    500: '#4CAF50',
                    600: '#43A047',
                    700: '#388E3C',
                    800: '#2E7D32',
                    900: '#1B5E20',
                },
                warning: {
                    50: '#FFF8E1',
                    100: '#FFECB3',
                    200: '#FFE082',
                    300: '#FFD54F',
                    400: '#FFCA28',
                    500: '#FFC107',
                    600: '#FFB300',
                    700: '#FFA000',
                    800: '#FF8F00',
                    900: '#FF6F00',
                }, 
                error: {
                    50: '#FDECEA',
                    100: '#F8C4C0',
                    200: '#F39B95',
                    300: '#EE726A',
                    400: '#E94C3F',
                    500: '#E41E11',
                    600: '#B6180E',
                    700: '#88120A',
                    800: '#5A0C07',
                    900: '#2D0603',
                },
                neutral: {
                    50: '#F8FAFC',
                    100: '#F1F5F9',
                    200: '#E2E8F0',
                    300: '#CBD5E1',
                    400: '#94A3B8',
                    500: '#64748B',
                    600: '#475569',
                    700: '#334155',
                    800: '#1E293B',
                    900: '#0F172A',
                },
                'custom-cyan': '#19c3f7',
                'custom-purple': '#7b2ff2',
                'custom-orange': '#f74a19',
                'custom-black': '#222222',
            },
            fontFamily: {
                sans: [
                    'Inter',
                    'ui-sans-serif',
                    'system-ui',
                    '-apple-system',
                    'BlinkMacSystemFont',
                    '"Segoe UI"',
                    'Roboto',
                    '"Helvetica Neue"',
                    'Arial',
                    'sans-serif',
                ],
            },
            boxShadow: {
                'soft': '0 2px 10px rgba(0, 0, 0, 0.05)',
                'medium': '0 4px 20px rgba(0, 0, 0, 0.08)',
                'hard': '0 10px 30px rgba(0, 0, 0, 0.12)', 
            },
            backgroundImage: {
                'hero-gradient': 'linear-gradient(135deg, #19c3f7 0%, #7b2ff2 100%)',
            },
        },
    },
    plugins: [
        plugin(function({ addUtilities }) {
            addUtilities({
              '.animation-delay-2000': {
                'animation-delay': '2s',
              },
              '.animation-delay-4000': {
                'animation-delay': '4s',
              },
            })
          })
    ],
};