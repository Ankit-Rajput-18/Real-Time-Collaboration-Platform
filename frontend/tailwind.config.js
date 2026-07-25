module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: { gray: { 850: '#1a1f2e' } },
      animation: { 'bounce-slow': 'bounce 3s infinite', 'pulse-slow': 'pulse 3s infinite' }
    }
  },
  plugins: []
}
