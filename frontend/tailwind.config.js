/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#ffffff',
        foreground: '#1a1a1a',
        primary: '#006400',
        'primary-foreground': '#ffffff',
        secondary: '#f5f5f5',
        card: '#ffffff',
        'card-foreground': '#1a1a1a',
        muted: '#f5f5f5',
        'muted-foreground': '#666666',
        border: '#e5e5e5',
        veil: 'rgba(0, 0, 0, 0.3)',
      },
      fontFamily: {
        display: ['Georgia', 'Times New Roman', 'serif'],
      },
      animation: {
        reveal: 'reveal 0.8s ease-out forwards',
      },
      keyframes: {
        reveal: {
          from: {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
    },
  },
  plugins: [],
}
