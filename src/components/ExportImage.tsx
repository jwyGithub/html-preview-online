'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import { toast } from 'sonner';
import { useState } from 'react';

interface ExportImageProps {
    targetRef: React.RefObject<HTMLDivElement | null>;
    disabled?: boolean;
}

export function ExportImage({ targetRef, disabled }: ExportImageProps) {
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        if (isExporting) return;
        setIsExporting(true);
        try {
            if (!targetRef.current) {
                throw new Error('导出目标不存在');
            }

            // 获取原始 iframe
            const originalIframe = targetRef.current.querySelector('iframe');
            if (!originalIframe) {
                throw new Error('找不到预览内容');
            }
            const url = originalIframe.src;

            // 获取原始iframe的尺寸
            const originalRect = originalIframe.getBoundingClientRect();
            const originalWidth = originalIframe.clientWidth || originalRect.width;
            const originalHeight = originalIframe.clientHeight || originalRect.height;

            // 创建临时 iframe 用于导出，保持与原始iframe相同的尺寸
            const tempIframe = document.createElement('iframe');
            tempIframe.style.position = 'absolute';
            tempIframe.style.top = '-9999px';
            tempIframe.style.left = '-9999px';
            tempIframe.style.width = `${originalWidth}px`;
            tempIframe.style.height = `${originalHeight}px`;
            tempIframe.style.border = 'none';
            tempIframe.style.overflow = 'hidden';
            tempIframe.sandbox = 'allow-same-origin allow-scripts';
            document.body.appendChild(tempIframe);

            try {
                // 等待 iframe 加载完成
                await new Promise<void>((resolve, reject) => {
                    tempIframe.onload = () => resolve();
                    tempIframe.onerror = () => reject(new Error('iframe 加载失败'));
                    tempIframe.src = url;
                });

                // 确保内容完全渲染
                await new Promise(resolve => setTimeout(resolve, 1000));

                // 获取 iframe 文档
                const iframeDocument = tempIframe.contentDocument || tempIframe.contentWindow?.document;
                if (!iframeDocument) {
                    throw new Error('无法访问预览内容');
                }

                // 优化iframe内容以获得更好的导出结果
                const styleElement = iframeDocument.createElement('style');
                styleElement.textContent = `
                    * { 
                        -webkit-print-color-adjust: exact !important; 
                        print-color-adjust: exact !important; 
                    }
                    body {
                        margin: 0;
                        padding: 0;
                        overflow: visible !important;
                        background-color: #ffffff;
                    }
                `;
                iframeDocument.head.appendChild(styleElement);

                // 使用 html2canvas 捕获内容，设置为原始尺寸
                const canvas = await html2canvas(iframeDocument.body, {
                    allowTaint: true,
                    useCORS: true,
                    logging: false,
                    backgroundColor: '#ffffff',
                    scale: window.devicePixelRatio, // 使用原始比例，不放大
                    scrollX: 0,
                    scrollY: 0,
                    width: originalWidth,
                    height: originalHeight,
                    onclone: documentClone => {
                        // 确保克隆的文档体现完整内容
                        const bodyClone = documentClone.querySelector('body');
                        if (bodyClone) {
                            bodyClone.style.overflow = 'visible';
                            bodyClone.style.margin = '0';
                            bodyClone.style.padding = '0';

                            // 确保所有内容都可见
                            const allElements = bodyClone.querySelectorAll('*');
                            allElements.forEach(el => {
                                const element = el as HTMLElement;
                                if (element.style) {
                                    // 处理可能导致内容截断的样式
                                    if (element.style.overflow === 'hidden') {
                                        element.style.overflow = 'visible';
                                    }
                                    // 确保图片显示完整
                                    if (element.tagName.toLowerCase() === 'img') {
                                        element.style.maxWidth = '100%';
                                        element.setAttribute('crossorigin', 'anonymous');
                                    }
                                }
                            });
                        }
                    }
                });

                // 转换为图片并下载
                canvas.toBlob(
                    blob => {
                        if (!blob) {
                            throw new Error('无法创建图片');
                        }

                        const fileName = new Date().getTime().toString();

                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${fileName}.png`;
                        a.click();
                        URL.revokeObjectURL(url);
                        toast.success('导出成功');
                    },
                    'image/png',
                    0.95
                ); // 保持较高图像质量
            } finally {
                // 清理临时 iframe
                document.body.removeChild(tempIframe);
            }
        } catch (error) {
            console.error('导出失败:', error);
            toast.error('导出失败: ' + (error instanceof Error ? error.message : '未知错误'));
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <Button variant='default' onClick={handleExport} disabled={disabled || isExporting} className='w-full'>
            <Download className={`h-4 w-4 mr-2 ${isExporting ? 'animate-pulse' : ''}`} />
            {isExporting ? '导出中...' : '导出图片'}
        </Button>
    );
}

