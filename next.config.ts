import type { NextConfig } from 'next';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || 'preview';

const nextConfig: NextConfig = {
    /* config options here */
    // 设置基础路径前缀
    basePath: `/${basePath}`,

    // 允许开发环境中的跨域请求
    experimental: {
        allowedDevOrigins: ['http://localhost']
    },

    async headers() {
        return [
            {
                // 匹配所有路径
                source: '/:path*',
                headers: [
                    {
                        key: 'Access-Control-Allow-Origin',
                        value: '*'
                    },
                    {
                        key: 'Access-Control-Allow-Methods',
                        value: 'GET, POST, PUT, DELETE, OPTIONS'
                    },
                    {
                        key: 'Access-Control-Allow-Headers',
                        value: 'X-Requested-With, Content-Type, Authorization'
                    },
                    {
                        key: 'Access-Control-Max-Age',
                        value: '86400'
                    }
                ]
            },
            {
                // 特别处理字体文件
                source: '/_next/static/media/:path*',
                headers: [
                    {
                        key: 'Access-Control-Allow-Origin',
                        value: '*'
                    },
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable'
                    }
                ]
            },
            {
                // 特别处理预览文件
                source: '/template.html',
                headers: [
                    {
                        key: 'Access-Control-Allow-Origin',
                        value: '*'
                    },
                    {
                        key: 'Content-Type',
                        value: 'text/html; charset=utf-8'
                    },
                    {
                        key: 'Cache-Control',
                        value: 'no-cache, no-store, must-revalidate'
                    }
                ]
            }
        ];
    }
};

export default nextConfig;

