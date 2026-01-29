module.exports = {
  plugins: {
    tailwindcss: require('tailwindcss'),
    autoprefixer: require('autoprefixer'),
    'postcss-clean': require('postcss-clean')({
      level: 2, // Advanced optimizations
    }),
  }
} 
