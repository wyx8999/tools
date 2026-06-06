/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#152033',
        paper: '#f7f3ea',
        copper: '#b2673d',
        mint: '#d9f1e8',
        night: '#111827',
      },
      boxShadow: {
        soft: '0 22px 70px rgba(21, 32, 51, 0.13)',
      },
    },
  },
  plugins: [],
};
