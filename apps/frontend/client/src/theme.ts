/**
 * Mantine theme configuration for FinVerse application
 * Defines brand colors, typography, and component styling
 */

import { createTheme } from '@mantine/core';
import type { MantineColorsTuple } from '@mantine/core';

// Define custom brand colors
const finBlue: MantineColorsTuple = [
    '#e6f3ff',
    '#cce5ff',
    '#99ccff',
    '#66b3ff',
    '#3399ff',
    '#0B74FF', // Primary brand blue
    '#0066e6',
    '#0052cc',
    '#003d99',
    '#002966',
];

const finGreen: MantineColorsTuple = [
    '#e6fff9',
    '#ccfff3',
    '#99ffe7',
    '#66ffdb',
    '#33ffcf',
    '#20C997', // Primary accent green  
    '#1db584',
    '#1a9971',
    '#177d5e',
    '#14614b',
];

const finGray: MantineColorsTuple = [
    '#f8f9fa',
    '#F6F9FC', // Light gray background
    '#e9ecef',
    '#dee2e6',
    '#ced4da',
    '#6B7C93', // Medium gray text
    '#495057',
    '#343a40',
    '#212529',
    '#0A2540', // Dark blue-gray
];

export const theme = createTheme({
    /** Primary color scheme */
    primaryColor: 'finBlue',

    /** Custom color palette */
    colors: {
        finBlue,
        finGreen,
        finGray,
    },

    /** Typography settings */
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    fontFamilyMonospace: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, monospace',
    headings: {
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        fontWeight: '600',
        sizes: {
            h1: { fontSize: '2.5rem', lineHeight: '1.2' },
            h2: { fontSize: '2rem', lineHeight: '1.3' },
            h3: { fontSize: '1.5rem', lineHeight: '1.4' },
            h4: { fontSize: '1.25rem', lineHeight: '1.4' },
            h5: { fontSize: '1.125rem', lineHeight: '1.5' },
            h6: { fontSize: '1rem', lineHeight: '1.5' },
        },
    },

    /** Default radius for components */
    defaultRadius: 'md',

    /** Spacing scale */
    spacing: {
        xs: '0.5rem',
        sm: '0.75rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
    },

    /** Breakpoints for responsive design */
    breakpoints: {
        xs: '30em',
        sm: '48em',
        md: '64em',
        lg: '80em',
        xl: '90em',
    },

    /** Component overrides */
    components: {
        Button: {
            defaultProps: {
                radius: 'md',
            },
            styles: {
                root: {
                    fontWeight: 500,
                    transition: 'all 0.2s ease',
                },
            },
        },

        Card: {
            defaultProps: {
                radius: 'lg',
                shadow: 'sm',
                withBorder: true,
            },
            styles: {
                root: {
                    transition: 'all 0.2s ease',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                    },
                },
            },
        },

        Modal: {
            defaultProps: {
                radius: 'lg',
                shadow: 'xl',
            },
            styles: {
                content: {
                    borderRadius: '12px',
                },
                header: {
                    borderBottom: '1px solid #e9ecef',
                    marginBottom: '1rem',
                    paddingBottom: '1rem',
                },
            },
        },

        Badge: {
            defaultProps: {
                radius: 'sm',
                size: 'sm',
            },
        },

        TextInput: {
            defaultProps: {
                radius: 'md',
            },
        },

        Select: {
            defaultProps: {
                radius: 'md',
            },
        },

        NumberInput: {
            defaultProps: {
                radius: 'md',
            },
        },

        AppShell: {
            styles: {
                header: {
                    borderBottom: '1px solid #e9ecef',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                },
                navbar: {
                    borderRight: '1px solid #e9ecef',
                },
            },
        },

        Rating: {
            styles: {
                symbolBody: {
                    color: '#ffc107',
                },
            },
        },
    },

    /** Other theme settings */
    other: {
        // Custom CSS variables for consistent styling
        gradients: {
            primary: 'linear-gradient(135deg, #0B74FF 0%, #20C997 100%)',
            secondary: 'linear-gradient(135deg, #F6F9FC 0%, #e9ecef 100%)',
            card: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(246, 249, 252, 0.9) 100%)',
        },
        shadows: {
            card: '0 2px 8px rgba(11, 116, 255, 0.08)',
            cardHover: '0 8px 25px rgba(11, 116, 255, 0.15)',
            modal: '0 20px 50px rgba(0, 0, 0, 0.15)',
        },
        animations: {
            fadeIn: 'fadeIn 0.3s ease-in-out',
            slideUp: 'slideUp 0.3s ease-out',
            scaleIn: 'scaleIn 0.2s ease-out',
        },
    },
});

// CSS-in-JS styles for animations
export const globalStyles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideUp {
    from { 
      opacity: 0;
      transform: translateY(20px);
    }
    to { 
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes scaleIn {
    from { 
      opacity: 0;
      transform: scale(0.9);
    }
    to { 
      opacity: 1;
      transform: scale(1);
    }
  }
  
  .hover-lift {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  
  .hover-lift:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(11, 116, 255, 0.15);
  }
  
  .gradient-text {
    background: linear-gradient(135deg, #0B74FF 0%, #20C997 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;