/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  staticPageGenerationTimeout: 120,
  images: {
    remotePatterns: [],
  },
  // For deployment under saudail.no (relative URLs work when basePath is set by host)
  basePath: process.env.NODE_ENV === 'production' && process.env.BASE_PATH ? process.env.BASE_PATH : '',
  assetPrefix: process.env.NODE_ENV === 'production' && process.env.BASE_PATH ? process.env.BASE_PATH : undefined,
};

module.exports = nextConfig;
