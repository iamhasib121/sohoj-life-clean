// next.config.js (রুট ফোল্ডারে, না থাকলে নতুন বানান)
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { dev }) => {
    if (dev) {
      config.devtool = 'source-map'; // eval-ভিত্তিক সোর্সম্যাপ এড়িয়ে যাবে
    }
    return config;
  },
};

module.exports = nextConfig;
