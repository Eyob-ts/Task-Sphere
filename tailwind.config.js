module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./src/**/*.css"
  ],
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    preflight: false, // Disable preflight to avoid conflicts with Angular Material
  },
  important: true,
}
