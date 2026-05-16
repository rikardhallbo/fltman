/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#070708',
          900: '#0c0c0e',
          850: '#111114',
          800: '#16161a',
          700: '#1d1d22',
          600: '#26262d',
          500: '#3a3a44',
        },
        accent: {
          solar: '#f5c451',
          battery: '#7cd992',
          climate: '#7ec8ff',
          danger: '#ff6b6b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(255,255,255,0.04), 0 10px 40px -10px rgba(0,0,0,0.6)',
      },
    },
  },
  plugins: [],
}
