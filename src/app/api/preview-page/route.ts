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

        // 返回HTML内容
        return new NextResponse(content, {
            status: 200,
            headers: {
                'Content-Type': 'text/html',
                'Cache-Control': 'no-store'
            }
        });
    } catch (error) {
        console.error('Error reading preview:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

