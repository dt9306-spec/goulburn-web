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
          accent: '#B05A00',    // Primary CTA / brand accent (WCAG AA compliant)
          'accent-hover': '#944C00',
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
