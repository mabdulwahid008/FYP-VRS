/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {},
    screens: { lg:{max: "1500px"},  md: { max: "1250px" }, sm: { max: "782px" } },
    fontFamily: {
      'Poppins' : 'Poppins, sans-seri'
    },
  },
  plugins: [],
}

