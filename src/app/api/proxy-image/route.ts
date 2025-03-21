import { NextRequest, NextResponse } from 'next/server';

// 代理图片请求以解决跨域问题
export async function GET(request: NextRequest) {
    try {
        // 从URL参数中获取目标图片URL
        const url = request.nextUrl.searchParams.get('url');

        // 验证URL参数
        if (!url) {
            return new NextResponse('Missing URL parameter', { status: 400 });
        }

        // 解码URL
        const decodedUrl = decodeURIComponent(url);
        console.log('Proxying image request for:', decodedUrl);

        // 获取图片内容
        const imageResponse = await fetch(decodedUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; ImageProxy/1.0)'
            }
        });

        // 检查响应状态
        if (!imageResponse.ok) {
            return new NextResponse(`Failed to fetch image: ${imageResponse.statusText}`, {
                status: imageResponse.status
            });
        }

        // 获取图片的二进制数据
        const imageBuffer = await imageResponse.arrayBuffer();

        // 获取原始Content-Type
        const contentType = imageResponse.headers.get('Content-Type') || 'image/jpeg';

        // 创建新的响应对象
        return new NextResponse(imageBuffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=3600'
            }
        });
    } catch (error) {
        console.error('Error proxying image:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

