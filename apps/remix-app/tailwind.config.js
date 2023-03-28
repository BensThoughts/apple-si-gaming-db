/** @type {import('tailwindcss').Config} */

const generateColorClass = (variable) => {
  return ({ opacityValue }) =>
    opacityValue
      ? `rgba(var(--${variable}), ${opacityValue})`
      : `rgb(var(--${variable}))`;
};

module.exports = {
  content: ['./app/**/*.{ts,tsx,jsx,js}'],
  theme: {
    extend: {
      colors: {
        'app-bg': generateColorClass('color-bg-primary'),
        'app-bg-secondary': generateColorClass('color-bg-secondary'),
        'primary': generateColorClass('color-app-primary'),
        'primary-highlight': generateColorClass('color-app-primary-highlight'),
        'secondary': generateColorClass('color-app-secondary'),
        'secondary-highlight': generateColorClass('color-app-secondary-highlight'),
        'tertiary': generateColorClass('color-app-tertiary'),
        'tertiary-highlight': generateColorClass('color-app-tertiary-highlight'),
        'gray': generateColorClass('color-app-gray'),
        'error': generateColorClass('color-app-error'),
        'snackbar-error': generateColorClass('color-snackbar-error'),
        'danger': generateColorClass('color-app-danger'),
        'danger-light': generateColorClass('color-app-danger-light'),
        'heart': generateColorClass('color-app-heart'),
        'modal': generateColorClass('color-bg-modal'),
        'text-primary': generateColorClass('color-text-primary'),
        'text-primary-highlight': generateColorClass('color-text-primary-highlight'),
        'text-error': generateColorClass('color-text-error'),
      },
      screens: {
        'navBarQuery': '960px',
        'postMetaBarQuery': '1190px',
      },
      textColor: {
        'primary': generateColorClass('color-text-primary'),
        'primary-highlight': generateColorClass('color-text-primary-highlight'),
        'primary-faded': generateColorClass('color-text-primary-faded'),
        'secondary': generateColorClass('color-text-secondary'),
        'tertiary': generateColorClass('color-app-secondary'),
        'error': generateColorClass('color-text-error'),
        'snackbar-error': generateColorClass('color-text-snackbar-error'),
      },
      borderWidth: {
        1: '1px',
      },
      animation: {
        'marquee': 'marquee 40s linear infinite',
        'marquee2': 'marquee2 40s linear infinite',
        'large-marquee': 'marquee 80s linear infinite',
        'large-marquee2': 'marquee2 80s linear infinite',
        'shimmer': 'shimmer 1s forwards',
        'dash': 'dash 20s linear infinite',
      },
      keyframes: {
        'marquee': {
          '0%': { transform: 'translateX(0)' },
          'to': { transform: 'translateX(-100%)' },
        },
        'marquee2': {
          '0%': { transform: 'translateX(100%)' },
          'to': { transform: 'translateX(0)' },
        },
        'shimmer': {
          'to': {
            content: 'var(--tw-content)',
            transform: 'translateX(100%)',
          },
        },
        'dash': {
          'to': {
            'stroke-dashoffset': 0,
          },
        },
      },
      boxShadowColor: {
        'black': 'rgba(var(--color-shadow))',
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
  plugins: [
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/container-queries'),
  ],
};
