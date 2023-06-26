/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/react-custom-datepicker-tailwind/dist/esm/index.js",
  ],
  theme: {
    extend: {
      screens: {
        xxs: "0px",
        xs: "360px",
        sm: "480px",
        msm: "540px",
        lsm: "640px",
        md: "720px",
        lg: "960px",
        "lg-max": "992px",
        xl: "1140px",
        "2xl": "1320px",
        "3xl": "1536px",
        "4xl": "1920px"
      },
      colors: {
        textColor: "#343436",
        main: "#00AB55",
        primary: "#DEF7EC",
        secondary: "#F1FFF9"
      },
      boxShadow: {
        "3xl": "3px 0px 15px rgba(235, 249, 243, 0.8)"
      },
      fontFamily: {
        sans: ['var(--font-inter)']
      }
    }
  },
  plugins: [
    require("daisyui"),
    require("tailwind-scrollbar")({ nocompatible: true }),
  ],
})
