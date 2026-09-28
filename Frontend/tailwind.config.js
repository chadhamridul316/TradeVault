/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#060d1f',
          900: '#0b1736',
          850: '#0f204b',
          800: '#14295e',
          750: '#1a3375',
          700: '#1e3a8a',
          600: '#1d4ed8',
          500: '#2563eb',
          400: '#3b82f6',
          300: '#60a5fa',
          200: '#93c5fd',
          100: '#dbeafe',
          50: '#eff6ff',
        },
        dark: {
          950: '#060d1f',
          900: '#0b1736',
          850: '#0f204b',
          800: '#14295e',
          750: '#1a3375',
          700: '#1e3a8a',
          600: '#2e4986',
          500: '#475569',
          400: '#64748b',
          300: '#94a3b8',
          200: '#cbd5e1',
          100: '#e2e8f0',
          50: '#eaecf0',
        },
        surface: {
          50: '#f4f6f8',
          100: '#eaecf0',
          200: '#dfe3e8',
          300: '#cfd5df',
          400: '#94a3b8',
        },
        offwhite: {
          50: '#f8fafc',
          100: '#f1f4f8',
          200: '#eaecf0',
          300: '#dfe3e8',
          400: '#cfd5df',
        },
        aurora: {
          emerald: '#059669',
          teal: '#0d9488',
          cyan: '#0284c7',
          blue: '#1d4ed8',
          indigo: '#4338ca',
          purple: '#7e22ce',
          violet: '#6d28d9',
          rose: '#e11d48',
          red: '#dc2626',
          amber: '#d97706',
          green: '#16a34a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Roboto Mono', 'monospace'],
      },
      boxShadow: {
        'card': '0 2px 10px -1px rgba(15, 23, 42, 0.05), 0 1px 3px 0 rgba(15, 23, 42, 0.03)',
        'card-hover': '0 8px 20px -2px rgba(15, 23, 42, 0.08), 0 3px 6px -1px rgba(15, 23, 42, 0.04)',
        'navy': '0 10px 25px -5px rgba(11, 23, 54, 0.25)',
        'glass': '0 6px 20px rgba(15, 23, 42, 0.04)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'soft-card': 'linear-gradient(135deg, #f7f9fb 0%, #edf1f5 100%)',
      },
      animation: {
        'pulse-subtle': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ambient-drift': 'ambientDrift 22s ease infinite alternate',
      },
      keyframes: {
        ambientDrift: {
          '0%': { transform: 'translate(0%, 0%) scale(1)' },
          '50%': { transform: 'translate(3%, -3%) scale(1.04)' },
          '100%': { transform: 'translate(-3%, 3%) scale(0.96)' },
        }
      }
    },
  },
  plugins: [],
}
