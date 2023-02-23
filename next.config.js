/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "avatars.gitthubusercontent.com",
    ],
  },
  swcMinify: false,
};

module.exports = nextConfig;
