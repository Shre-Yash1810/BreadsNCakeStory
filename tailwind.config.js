/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./context/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FAF7F2',
          100: '#F5EFE6',
          200: '#EADECE',
          DEFAULT: '#FDFBF7',
          dark: '#EFEAE0',
        },
        luxury: {
          gold: '#C5A880',
          goldlight: '#DFBA73',
          golddark: '#AA8855',
          champagne: '#F3EAD3',
        },
        cocoa: {
          50: '#F5EBEB',
          100: '#E7D4D4',
          500: '#3E2723',
          800: '#2A1715',
          900: '#1F1110',
          DEFAULT: '#2E1C1A',
        }
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #DFBA73 0%, #C5A880 50%, #AA8855 100%)',
        'cream-gradient': 'linear-gradient(180deg, #FDFBF7 0%, #FAF7F2 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.3) 100%)',
        'dark-gradient': 'linear-gradient(180deg, #2E1C1A 0%, #1F1110 100%)',
      },
      boxShadow: {
        'premium': '0 20px 40px -15px rgba(62, 39, 35, 0.1)',
        'premium-hover': '0 30px 60px -20px rgba(62, 39, 35, 0.2)',
        'gold-glow': '0 10px 30px -10px rgba(197, 168, 128, 0.5)',
      }
    },
  },
  plugins: [],
}
