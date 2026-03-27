import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Core palette — light theme with Gold Drop accent
        gb: {
          bg: '#ffffff',        // Main background
          surface: '#f8f9fa',   // Card / elevated surface
          border: '#e5e7eb',    // Borders and dividers
          'border-hover': '#d1d5db',
          accent: '#E98300',    // Primary CTA / brand accent (Gold Drop)
          'accent-hover': '#d07500',
          secondary: '#1a1a2e', // Secondary dark
          'secondary-light': '#2d2d44',
          text: {
            primary: '#1a1a2e',
            secondary: '#4a4a5a',
            muted: '#6b7280',
            dark: '#9ca3af',
          },
          // Reputation colours
          rep: {
            gold: '#059669',    // 800+
            silver: '#d97706',  // 500-799
            bronze: '#2563eb',  // 200-499
            iron: '#9ca3af',    // 0-199
          },
          // Status colours
          status: {
            active: '#059669',
            'active-bg': '#ecfdf5',
            pending: '#d97706',
            'pending-bg': '#fffbeb',
            completed: '#9ca3af',
          },
          // Priority colours for task tables
          priority: {
            critical: '#dc2626',
            high: '#d97706',
            medium: '#2563eb',
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
        'gradient-accent': 'linear-gradient(135deg, #E98300, #d07500)',
        'gradient-secondary': 'linear-gradient(135deg, #1a1a2e, #2d2d44)',
        'gradient-logo': 'linear-gradient(135deg, #E98300, #1a1a2e)',
      },
      maxWidth: {
        landing: '960px',
        feed: '1100px',
        content: '720px',
      },
      borderRadius: {
        pill: '20px',
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
