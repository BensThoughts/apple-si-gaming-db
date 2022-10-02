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
      'modal': generateColorClass('color-bg-modal'),
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
      textColor: {
        'primary': generateColorClass('color-text-primary'),
        'primary-highlight': generateColorClass('color-text-primary-highlight'),
        'primary-faded': generateColorClass('color-text-primary-faded'),
        'secondary': generateColorClass('color-text-secondary'),
        'color-error': generateColorClass('color-text-error'),
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
      // fontFamily: {
      //   'merriweather': ['"Merriweather"', 'serif'],
      // },
      // animation: {
      //   'enter': 'enter 200ms ease-out',
      //   'slide-in': 'slide-in 1.2s cubic-bezier(.41,.73,.51,1.02)',
      //   'leave': 'leave 150ms ease-in forwards',
      // },
      // keyframes: {
      //   'enter': {
      //     '0%': { transform: 'scale(0.9)', opacity: 0 },
      //     '100%': { transform: 'scale(1)', opacity: 1 },
      //   },
      //   'leave': {
      //     '0%': { transform: 'scale(1)', opacity: 1 },
      //     '100%': { transform: 'scale(0.9)', opacity: 0 },
      //   },
      //   'slide-in': {
      //     '0%': { transform: 'translateY(-100%)' },
      //     '100%': { transform: 'translateY(0)' },
      //   },
      // },
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
