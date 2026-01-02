module.exports = {
    theme: {
        extend: {
            colors: {
                navy: {
                    50: '#f0f4f8',
                    100: '#d9e2ec',
                    800: '#102a43',
                    900: '#0a1929', // Deep Navy
                },
                primary: {
                    50: '#eff6ff',
                    100: '#dbeafe',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                    900: '#1e3a8a',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            keyframes: {
                'shimmer': {
                    '0%': { backgroundPosition: '200% 0' },
                    '100%': { backgroundPosition: '-200% 0' },
                },
                'progress-indeterminate': {
                    '0%': { left: '-35%', right: '100%' },
                    '60%': { left: '100%', right: '-90%' },
                    '100%': { left: '100%', right: '-90%' },
                },
            },
            animation: {
                'shimmer': 'shimmer 2s linear infinite',
                'progress-indeterminate': 'progress-indeterminate 1.5s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite',
            },
        },
    },
}
