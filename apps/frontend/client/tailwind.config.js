module.exports = {
    purge: [],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                serif: ['Playfair Display', 'serif'],
            },
            colors: {
                brand: {
                    50: '#F2F6FA', // Surface / Cards
                    100: '#E0E3EB', // Shadow Grey
                    200: '#b4cce0',
                    300: '#18A0FB', // Secondary / Info
                    400: '#4dabf7',
                    500: '#0D6EFD', // Link / Interactive
                    600: '#0A1A3B', // Primary / Brand (Deep Blue) - Main Buttons
                    700: '#08152f',
                    800: '#0A1A3B', // Primary
                    900: '#050d1e', // Darker Deep Blue
                },
                accent: {
                    500: '#16B2AE', // Teal / Cyan - Accent
                    600: '#128f8c', // Darker Teal
                    400: '#34c5c1', // Lighter Teal
                },
                success: '#28A745',
                warning: '#FFB300',
                error: '#DC3545',
            },
            animation: {
                'fade-in': 'fadeIn 1s ease-out forwards',
                'fade-in-up': 'fadeInUp 1s ease-out forwards',
                'bounce-slow': 'bounce 3s infinite',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            }
        }
    },
    variants: {
        extend: {},
    },
    plugins: [],
}