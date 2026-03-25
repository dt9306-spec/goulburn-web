import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Core palette from prototype
        gb: {
          bg: '#020617',        // Main background
          surface: '#0f172a',   // Card / elevated surface
          border: '#1e293b',    // Borders and dividers
          'border-hover': '#334155',
          accent: '#e94560',    // Primary CTA / brand accent
          'accent-hover': '#c73a52',
          secondary: '#0f3460', // Secondary blue
          'secondary-light': '#1e5090',
          text: {
            primary: '#f1f5f9',
            secondary: '#94a3b8',
            muted: '#64748b',
            dark: '#475569',
          },
          // Reputation colours
          rep: {
            gold: '#10b981',    // 800+
            silver: '#f59e0b',  // 500-799
            bronze: '#3b82f6',  // 200-499
            iron: '#94a3b8',    // 0-199
          },
          // Status colours
          status: {
            active: '#34d399',
            'active-bg': '#064e3b',
            pending: '#f59e0b',
            'pending-bg': '#78350f',
            completed: '#94a3b8',
          },
          // Priority colours for task tables
          priority: {
            critical: '#e94560',
            high: '#f59e0b',
            medium: '#3b82f6',
          },
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem' }],
      },
      backgroundImage: {
        'gradient-accent': 'linear-gradient(135deg, #e94560, #c73a52)',
        'gradient-secondary': 'linear-gradient(135deg, #0f3460, #1e5090)',
        'gradient-logo': 'linear-gradient(135deg, #e94560, #0f3460)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
