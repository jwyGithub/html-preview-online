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
    const [isIframeLoaded, setIsIframeLoaded] = useState(false);

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
        setIsIframeLoaded(false);
    }, [previewUrl]);

    // 定时检查iframe高度
    useEffect(() => {
        if (!previewUrl || !iframeRef.current || !isIframeLoaded) return;

        // 初始调整后，每秒检查一次高度变化
        const intervalId = setInterval(() => {
            if (iframeRef.current) {
                try {
                    const iframeDocument = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
                    if (iframeDocument && iframeDocument.body) {
                        const scrollHeight = Math.max(
                            iframeDocument.body.scrollHeight,
                            iframeDocument.documentElement.scrollHeight,
                            iframeDocument.body.offsetHeight,
                            iframeDocument.documentElement.offsetHeight
                        );
                        
                        if (scrollHeight > 0 && scrollHeight !== iframeHeight) {
                            setIframeHeight(scrollHeight + 30);
                        }
                    }
                } catch {
                    // 跨域访问错误，忽略
                }
            }
        }, 1000);

        return () => clearInterval(intervalId);
    }, [previewUrl, isIframeLoaded, iframeHeight]);

    // 调整iframe高度的函数
    const handleIframeLoad = () => {
        setIsIframeLoaded(true);
        if (iframeRef.current) {
            try {
                // 尝试获取iframe内容高度
                const iframeDocument = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
                if (iframeDocument && iframeDocument.body) {
                    // 确保iframe内的图片和外部资源能够正确加载
                    const images = iframeDocument.querySelectorAll('img');
                    let imagesLoaded = images.length;
                    
                    // 如果没有图片，直接调整高度
                    if (imagesLoaded === 0) {
                        adjustHeight();
                    } else {
                        // 为所有图片添加加载完成事件，以确保在所有内容加载后再计算高度
                        images.forEach(img => {
                            if (img.complete) {
                                imagesLoaded--;
                                if (imagesLoaded === 0) adjustHeight();
                            } else {
                                img.onload = () => {
                                    imagesLoaded--;
                                    if (imagesLoaded === 0) adjustHeight();
                                };
                                img.onerror = () => {
                                    imagesLoaded--;
                                    if (imagesLoaded === 0) adjustHeight();
                                };
                            }
                        });
                    }
                    
                    // 内容大小调整函数
                    function adjustHeight() {
                        if (!iframeRef.current) return;
                        
                        const iframeDocument = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
                        if (!iframeDocument || !iframeDocument.body) return;
                        
                        // 检查最大滚动高度
                        const scrollHeight = Math.max(
                            iframeDocument.body.scrollHeight,
                            iframeDocument.documentElement.scrollHeight,
                            iframeDocument.body.offsetHeight,
                            iframeDocument.documentElement.offsetHeight
                        );
                        
                        if (scrollHeight > 0) {
                            // 添加一些额外空间
                            setIframeHeight(scrollHeight + 30);
                        }
                    }
                }
            } catch (e) {
                console.warn('无法访问iframe内容高度:', e);
                // 默认高度
                setIframeHeight(500);
            }
        }
    };

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
                            sandbox='allow-scripts allow-same-origin'
                            onLoad={handleIframeLoad}
                            style={{
                                backgroundColor: '#fff',
                                display: 'block',
                                height: iframeHeight ? `${iframeHeight}px` : '500px',
                                minHeight: '300px',
                                transition: 'height 0.3s ease'
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

