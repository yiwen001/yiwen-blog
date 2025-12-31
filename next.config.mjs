/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
        config.module.rules.push({
          test: /\.(glsl|vs|fs|vert|frag)$/,
          use: ['raw-loader'],
        });
    
        return config;
      },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'github.com',
                port: '',
                pathname: '/favicon.ico',
            },
            {
                protocol: 'https',
                hostname: 'www.google.com',
                port: '',
                pathname: '/chrome/static/images/chrome-logo.svg',
            },
        ],
    },
};

export default nextConfig;
