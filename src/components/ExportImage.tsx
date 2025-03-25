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

            // 创建临时 iframe 用于导出
            const tempIframe = document.createElement('iframe');
            tempIframe.style.position = 'absolute';
            tempIframe.style.top = '-9999px';
            tempIframe.style.left = '-9999px';
            tempIframe.style.border = 'none';
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

                // 使用 html2canvas 捕获内容
                const canvas = await html2canvas(iframeDocument.body, {
                    allowTaint: true,
                    useCORS: true,
                    logging: false,
                    backgroundColor: '#ffffff',
                    scale: window.devicePixelRatio || 1, // 使用设备像素比来保证清晰度
                    onclone: (documentClone) => {
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
                                const computedStyle = window.getComputedStyle(element);
                                
                                // 处理可能导致内容截断的样式
                                if (computedStyle.overflow === 'hidden') {
                                    element.style.overflow = 'visible';
                                }
                            });
                        }
                    }
                });

                // 转换为图片并下载
                canvas.toBlob(blob => {
                    if (!blob) {
                        throw new Error('无法创建图片');
                    }
                    
                    // 获取文件名 - 优先使用iframe的title
                    let fileName = '';
                    
                    // 尝试获取iframe的title
                    try {
                        const iframeTitle = originalIframe.title || 
                                          tempIframe.contentDocument?.title || 
                                          tempIframe.contentWindow?.document.title;
                        
                        if (iframeTitle && iframeTitle.trim() !== '' && iframeTitle.toLowerCase() !== 'preview') {
                            fileName = iframeTitle.trim();
                        }
                    } catch (e) {
                        console.warn('获取iframe标题失败:', e);
                    }
                    
                    // 如果没有有效的title，使用时间格式
                    if (!fileName) {
                        const now = new Date();
                        const year = now.getFullYear();
                        const month = String(now.getMonth() + 1).padStart(2, '0');
                        const day = String(now.getDate()).padStart(2, '0');
                        const hours = String(now.getHours()).padStart(2, '0');
                        const minutes = String(now.getMinutes()).padStart(2, '0');
                        const seconds = String(now.getSeconds()).padStart(2, '0');
                        
                        fileName = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
                    }
                    
                    // 处理文件名中的特殊字符，确保文件名有效
                    fileName = fileName.replace(/[\\/:*?"<>|]/g, '-');
                    
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${fileName}.png`;
                    a.click();
                    URL.revokeObjectURL(url);
                    toast.success('导出成功');
                }, 'image/png');
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
        <Button 
            variant='default' 
            onClick={handleExport} 
            disabled={disabled || isExporting} 
            className='w-full'
        >
            <Download className={`h-4 w-4 mr-2 ${isExporting ? 'animate-pulse' : ''}`} />
            {isExporting ? '导出中...' : '导出图片'}
        </Button>
    );
}

