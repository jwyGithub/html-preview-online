import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export async function GET() {
    try {
        const templatePath = path.join(process.cwd(), 'public', 'template.html');

        // 检查文件是否存在
        if (!existsSync(templatePath)) {
            return new NextResponse('Preview not found', { status: 404 });
        }

        // 读取模板文件
        const content = await readFile(templatePath, 'utf-8');

        // 返回HTML内容，添加适当的标头以确保正确渲染
        return new NextResponse(content, {
            status: 200,
            headers: {
                'Content-Type': 'text/html; charset=utf-8',
                'Cache-Control': 'no-store, no-cache, must-revalidate',
                'X-Content-Type-Options': 'nosniff',
                'X-Frame-Options': 'SAMEORIGIN'
            }
        });
    } catch (error) {
        console.error('Error reading preview:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

