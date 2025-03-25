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

        // 尝试从HTML内容中提取标题
        let pageTitle = '';
        try {
            const titleMatch = html.match(/<title>(.*?)<\/title>/i);
            if (titleMatch && titleMatch[1]) {
                pageTitle = titleMatch[1].trim();
            }

            // 如果没有title标签，尝试从第一个h1或h2标签提取
            if (!pageTitle) {
                const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
                if (h1Match && h1Match[1]) {
                    pageTitle = h1Match[1].replace(/<[^>]*>/g, '').trim(); // 移除嵌套标签
                } else {
                    const h2Match = html.match(/<h2[^>]*>(.*?)<\/h2>/i);
                    if (h2Match && h2Match[1]) {
                        pageTitle = h2Match[1].replace(/<[^>]*>/g, '').trim(); // 移除嵌套标签
                    }
                }
            }
        } catch (e) {
            console.warn('提取标题失败:', e);
        }

        // 如果仍然没有标题，使用默认标题
        if (!pageTitle) {
            pageTitle = 'HTML预览';
        }

        // 确保public目录存在
        const publicDir = path.join(process.cwd(), 'public');
        if (!existsSync(publicDir)) {
            await mkdir(publicDir, { recursive: true });
        }

        // 设置template.html的路径
        const templatePath = path.join(publicDir, 'template.html');

        // 准备HTML内容
        const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageTitle}</title>
    <style>
        /* 简化样式，专注于内容展示 */
        body {
            margin: 0;
            padding: 0;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        /* 确保图片等内容不溢出 */
        img, video, canvas, svg {
            max-width: 100%;
            height: auto;
        }
    </style>
</head>
<body>
    ${html}
</body>
</html>`;

        // 写入HTML内容到template.html
        await writeFile(templatePath, htmlContent, 'utf-8');

        const basePath = process.env.NEXT_PUBLIC_BASE_PATH || 'preview';

        // 生成预览URL
        const previewUrl = `/${basePath}/api/preview-page`;

        // 返回预览URL
        return new NextResponse(JSON.stringify({ url: previewUrl }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error generating preview:', error);
        return NextResponse.json({ error: 'Failed to generate preview' }, { status: 500 });
    }
}

