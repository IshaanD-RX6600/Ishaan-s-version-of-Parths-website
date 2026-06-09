/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/parthpandit182009.github.io' : '',
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
