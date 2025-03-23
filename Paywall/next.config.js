/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost', 'stripe.com'],
  },
  // This ensures that the paywall solution can be published as a package
  transpilePackages: ['paywall-solution'],
};

module.exports = nextConfig; 