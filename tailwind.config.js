/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF6600',
          dark: '#E65C00',
          light: '#FF8533',
        },
        status: {
          onTrack: '#FF6600',
          inProgress: '#FFA500',
          needsAttention: '#DC2626',
        },
      },
      fontFamily: {
        sans: ['"Helvetica Neue LT Std"', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
      fontWeight: {
        light: '300',      // Light
        normal: '400',     // Roman (normal body text)
        roman: '400',      // Roman
        bold: '700',       // Bold (headings, subheadings)
      },
      letterSpacing: {
        'tight-heading': '-0.04em',      // -40 knip for large headings (Rubriker 1)
        'tight-subheading': '-0.025em',  // -25 knip for subheadings
        'tight-text': '-0.015em',        // -15 knip for short texts
        'body': '0em',                   // 0 knip for body text (no kerning)
      },
      lineHeight: {
        'tight-heading': '1.1',          // Compact line-height for headings
        'tight': '1.2',                  // Tight line-height for subheadings
        'normal': '1.5',                 // Normal line-height for body text
        'relaxed': '1.75',               // Relaxed line-height when needed
      },
    },
  },
  plugins: [],
}
