import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        industrial: {
          navy: '#101C2C',
          'navy-sidebar': '#172D42',
          'navy-card': '#132235',
          'navy-darker': '#0B131E',
          teal: '#16A085',
          'teal-light': '#1ABC9C',
          'teal-subtle': '#E8F8F5',
          cyan: '#38BDF8',
          surface: '#F5F7F8',
          card: '#FFFFFF',
          text: '#172033',
          'text-muted': '#64748B',
          border: '#E2E8F0',
          'border-dark': '#1F334D',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        arabic: ['Cairo', 'IBM Plex Sans Arabic', 'sans-serif'],
      },
      boxShadow: {
        'industrial': '0 4px 20px -2px rgba(16, 28, 44, 0.08), 0 2px 6px -1px rgba(16, 28, 44, 0.04)',
        'industrial-glow': '0 0 25px -5px rgba(22, 160, 133, 0.35)',
        'industrial-cyan': '0 0 25px -5px rgba(56, 189, 248, 0.35)',
      },
    },
  },
  plugins: [],
} satisfies Config;
