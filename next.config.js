/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:8080/api/:path*' // 将所有 /api 请求代理到 Spring Boot 后端
        }
      ];
    },
  };
  
  module.exports = nextConfig;
  
  