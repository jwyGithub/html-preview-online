'use client';

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useRef, useState, useEffect } from 'react';
import { ExportImage } from '@/components/ExportImage';

interface PreviewAreaProps {
    previewUrl?: string;
}

export function PreviewArea({ previewUrl }: PreviewAreaProps) {
    const previewRef = useRef<HTMLDivElement | null>(null);
    const iframeRef = useRef<HTMLIFrameElement | null>(null);
    const [iframeHeight, setIframeHeight] = useState<number | null>(null);

    // 监听iframe发送的resize消息
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data && event.data.type === 'resize') {
                const height = event.data.height;
                if (height && typeof height === 'number') {
                    // 添加一些额外边距
                    setIframeHeight(height + 20);
                }
            }
        };

        window.addEventListener('message', handleMessage);
        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, []);

    // 重置iframe高度当URL变化时
    useEffect(() => {
        setIframeHeight(null);
    }, [previewUrl]);

    return (
        <Card className='flex flex-col h-full'>
            <CardHeader className='py-2 px-4 shrink-0'>
                <CardTitle>预览</CardTitle>
            </CardHeader>
            <CardContent className='flex-1 bg-gray-100 overflow-auto p-0'>
                <div ref={previewRef} className='relative w-full h-auto'>
                    {previewUrl ? (
                        <iframe
                            ref={iframeRef}
                            src={previewUrl}
                            className='border-0 w-full'
                            title='Preview'
                            sandbox='allow-scripts'
                            style={{
                                backgroundColor: '#fff',
                                display: 'block',
                                height: iframeHeight ? `${iframeHeight}px` : '500px'
                            }}
                        />
                    ) : (
                        <div className='flex items-center justify-center h-[400px] text-muted-foreground'>
                            点击&quot;生成预览&quot;按钮查看效果
                        </div>
                    )}
                </div>
            </CardContent>
            <CardFooter className='py-2 px-4 shrink-0'>
                <ExportImage targetRef={previewRef} disabled={!previewUrl} />
            </CardFooter>
        </Card>
    );
}

