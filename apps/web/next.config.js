/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@falak-runner/game'],
  experimental: {
    esmExternals: 'loose',
  },
  webpack: (config, { isServer }) => {
    // Don't bundle Phaser on the server
    if (isServer) {
      config.externals = [...(config.externals || []), 'phaser'];
    } else {
      // For client-side, handle Phaser specially
      config.externals = {
        ...config.externals,
        phaser: 'Phaser'
      };
      
      // Add fallbacks for Node.js modules
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }
    
    return config;
  },
};

module.exports = nextConfig; 