/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      borderColor: {
        border: "hsl(var(--border))",
      },
      backgroundColor: {
        background: "hsl(var(--background))",
      },
      textColor: {
        foreground: "hsl(var(--foreground))",
      },
      screens: {
        xs: "480px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
    },
  },
  plugins: [],
}

