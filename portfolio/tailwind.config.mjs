/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        base: {
          page: '#0a0a0f',
          surface: '#13131a',
          card: '#1c1c26',
          border: '#26262f',
        },
        accent: {
          DEFAULT: '#3b82f6',
          hover: '#60a5fa',
          glow: 'rgba(59, 130, 246, 0.4)',
        },
        ink: {
          DEFAULT: '#f8f8f2',
          muted: '#cbd5e1',
          dim: '#94a3b8',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Text"',
          '"SF Pro Display"',
          '"Helvetica Neue"',
          '"Segoe UI"',
          'Roboto',
          'system-ui',
          'sans-serif',
        ],
        display: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"Helvetica Neue"',
          '"Segoe UI"',
          'Roboto',
          'system-ui',
          'sans-serif',
        ],
        mono: [
          'ui-monospace',
          '"SF Mono"',
          'Menlo',
          'Monaco',
          '"JetBrains Mono"',
          'Consolas',
          '"Liberation Mono"',
          'monospace',
        ],
      },
      fontSize: {
        'display-2xl': ['clamp(3.5rem, 9vw, 7.5rem)', { lineHeight: '0.96', letterSpacing: '-0.035em' }],
        'display-xl':  ['clamp(2.75rem, 6vw, 5rem)',  { lineHeight: '1.04', letterSpacing: '-0.028em' }],
        'display-lg':  ['clamp(2rem, 4.5vw, 3.5rem)', { lineHeight: '1.1',  letterSpacing: '-0.022em' }],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2.5s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':       { transform: 'translateY(-12px)' },
        },
        glow: {
          '0%':   { boxShadow: '0 0 20px rgba(59,130,246,0.2)' },
          '100%': { boxShadow: '0 0 40px rgba(59,130,246,0.5)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
