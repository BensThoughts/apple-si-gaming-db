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
      'accent': generateColorClass('color-app-accent'),
      'app-bg': generateColorClass('color-bg-primary'),
      'terminal': generateColorClass('color-bg-terminal'),
      'primary-text': generateColorClass('color-text-primary'),
      'secondary-text': generateColorClass('color-text-secondary'),
      'black': colors.black,
      'current': colors.current,
      'transparent': colors.transparent,
    },
    extend: {
      fontFamily: {
        'press-start': ['"Press Start 2P"', 'cursive'],
        'roboto-slab': ['"Roboto Slab"', 'serif'],
        'merriweather': ['"Merriweather"', 'serif'],
      },
      backgroundColor: {
        'app-bg': generateColorClass('color-bg-primary'),
        'primary': generateColorClass('color-app-primary'),
        'secondary': generateColorClass('color-app-secondary'),
        'accent': generateColorClass('color-app-accent'),
        'terminal': generateColorClass('color-bg-terminal'),
      },
      textColor: {
        'primary': generateColorClass('color-text-primary'),
        'secondary': generateColorClass('color-text-secondary'),
        'icon-primary': generateColorClass('color-app-primary'),
        'icon-primary-highlight': generateColorClass('color-app-primary-highlight'),
        'icon-secondary': generateColorClass('color-app-secondary'),
        'icon-secondary-highlight': generateColorClass('color-app-secondary-highlight'),
        'icon-accent': generateColorClass('color-app-accent'),
        'color-inline-code': generateColorClass('color-text-inline-code'),
      },
      // borderColor: {
      //   'primary': generateColorClass('color-app-primary'),
      //   'secondary': generateColorClass('color-app-secondary'),
      //   'accent': generateColorClass('color-app-accent'),
      // },
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
