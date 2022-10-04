/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.njk"],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    fontFamily: {
			'sans': ['"Exo 2"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
		},
    extend: {
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      colors: {
        'primary': '#1fb6ff',
        'secondary': '#7e5bef',
      },
    }
  },
  plugins: [],
}
