/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors');

const generateColorClass = (variable) => {
  return ({ opacityValue }) =>
    opacityValue
      ? `rgba(var(--${variable}), ${opacityValue})`
      : `rgb(var(--${variable}))`;
};

module.exports = {
  content: ['./app/**/*.{ts,tsx,jsx,js}'],
  theme: {
    colors: {
      'primary': generateColorClass('color-app-primary'),
      'primary-highlight': generateColorClass('color-app-primary-highlight'),
      'secondary': generateColorClass('color-app-secondary'),
      'secondary-highlight': generateColorClass('color-app-secondary-highlight'),
      'tertiary': generateColorClass('color-app-tertiary'),
      'accent': generateColorClass('color-app-accent'),
      'app-bg': generateColorClass('color-bg-primary'),
      'app-bg-secondary': generateColorClass('color-bg-secondary'),
      'primary-text': generateColorClass('color-text-primary'),
      'primary-text-highlight': generateColorClass('color-text-primary-highlight'),
      'primary-text-faded': generateColorClass('color-text-primary-faded'),
      'secondary-text': generateColorClass('color-text-secondary'),
      'color-error': generateColorClass('color-app-error'),
      'black': colors.black,
      'white': colors.white,
      'current': colors.current,
      'transparent': colors.transparent,
    },
    extend: {
      fontFamily: {
        'press-start': ['"Press Start 2P"', 'cursive'],
        'roboto-slab': ['"Roboto Slab"', 'serif'],
        'merriweather': ['"Merriweather"', 'serif'],
      },
      textColor: {
        'primary': generateColorClass('color-text-primary'),
        'primary-highlight': generateColorClass('color-text-primary-highlight'),
        'primary-faded': generateColorClass('color-text-primary-faded'),
        'secondary': generateColorClass('color-text-secondary'),
        'icon-primary': generateColorClass('color-app-primary'),
        'icon-primary-highlight': generateColorClass('color-app-primary-highlight'),
        'icon-secondary': generateColorClass('color-app-secondary'),
        'icon-secondary-highlight': generateColorClass('color-app-secondary-highlight'),
        'icon-tertiary': generateColorClass('color-app-tertiary'),
        'icon-accent': generateColorClass('color-app-accent'),
      },
      borderWidth: {
        1: '1px',
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ['active'],
      borderOpacity: ['active'],
    },
  },
  plugins: [],
};
