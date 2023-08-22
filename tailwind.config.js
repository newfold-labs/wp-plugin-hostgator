const yoastPreset = require("@yoast/tailwindcss-preset");
/** @type {import('tailwindcss').Config} */
module.exports = {
    presets: [yoastPreset],
    content: [
        ...yoastPreset.content,
        "./node_modules/@newfold-labs/wp-module-ecommerce/build/index.js",
        "./src/**/*.js",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#1F2044",
                    50: "#EBEBF6",
					100: "#C2C3E3",
					200: "#7274BE",
					300: "#444693",
					400: "#31336B",
					500: "#1F2044",
					600: "#1A1B39",
					700: "#16172F",
					800: "#0F1021",
					900: "#090913",
                    dark: "#191936",
                    light: "#2E93EE",
                    lighter: "#CDD8DF",
                },
                secondary: {
                    DEFAULT: "#FFCF00",
                    dark: "#ECA93E",
                    light: "#FF9144",
                    lighter: "#FFF8DB",
                },
                title: "#1F2044",
                body: "#363636",
                link: "#2E93EE",
                line: "#E2E8F0",
                white: "#FFFFFF",
                offWhite: "#F5F6F8",
                black: "#000000",
                canvas: "#F5F6F8",
            },
        },
    },
    plugins: [],
}