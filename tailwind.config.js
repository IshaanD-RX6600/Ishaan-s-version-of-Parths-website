module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        head: ['var(--font-head)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif']
      },
      colors: {
        sand: '#F5ECD7',
        ocean: '#0D3B5E',
        coral: '#E8A87C',
        teal: '#5BC4BF',
        seafoam: '#FAF7F0',
        driftwood: '#1A1205',
        sky: '#B8D4E3'
      },
      boxShadow: {
        none: 'none'
      }
    }
  },
  plugins: []
};
