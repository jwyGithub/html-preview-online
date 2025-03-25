import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export async function POST(request: Request) {
    try {
        // 解析请求体
        const body = await request.json();
        const { html } = body;

        // 验证HTML内容
        if (!html || typeof html !== 'string') {
            return NextResponse.json({ error: 'HTML content is required' }, { status: 400 });
        }

        // 尝试从HTML内容中提取标题（仅用于后续处理，如导出文件命名）
        const pageTitle = new Date().getTime();

        // 确保public目录存在
        const publicDir = path.join(process.cwd(), 'public');
        if (!existsSync(publicDir)) {
            await mkdir(publicDir, { recursive: true });
        }

        // 设置template.html的路径
        const templatePath = path.join(publicDir, 'template.html');

        // 直接使用用户提供的HTML内容
        const htmlContent = html;

        // 写入HTML内容到template.html
        await writeFile(templatePath, htmlContent, 'utf-8');

        const basePath = process.env.NEXT_PUBLIC_BASE_PATH || 'preview';

        // 生成预览URL
        const previewUrl = `/${basePath}/api/preview-page`;

        // 返回预览URL，同时携带提取的标题信息
        return new NextResponse(
            JSON.stringify({
                url: previewUrl,
                title: pageTitle || 'HTML预览' // 提供标题信息供前端使用
            }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    } catch (error) {
        console.error('Error generating preview:', error);
        return NextResponse.json({ error: 'Failed to generate preview' }, { status: 500 });
    }
}

