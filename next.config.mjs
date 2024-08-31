/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
      COINGECKO_API_KEY: process.env.COINGECKO_API_KEY,
    },
    images: {
      domains: ['coin-images.coingecko.com'],
    },
  };
  
  export default nextConfig;