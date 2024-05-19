/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.externals.push({ vectordb: "vectordb" });
    return config;
  },
};

module.exports = nextConfig;
