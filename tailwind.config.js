/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx,js,jsx}", "./public/*.html"],
  theme: {
    extend: {
      colors: {
        primary: "#1F4288",
        secondary: "#515151",
        subsecondary: "#EDF5FF",
      },
      backgroundImage: {
        "landing": "url('../images/landing.jpg')",
      },
    },
  },
  plugins: [],
}

