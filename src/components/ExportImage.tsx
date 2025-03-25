'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import { toast } from 'sonner';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { devices } from '@/config/devices';

interface ExportImageProps {
    targetRef: React.RefObject<HTMLDivElement | null>;
    disabled?: boolean;
    selectedDevice: string;
    onDeviceChange: (deviceId: string) => void;
}

export function ExportImage({ targetRef, disabled, selectedDevice, onDeviceChange }: ExportImageProps) {
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        if (isExporting) return;
        setIsExporting(true);
        try {
            if (!targetRef.current) {
                throw new Error('导出目标不存在');
            }

            // 注意：我们不直接从预览区获取样式，而是创建新iframe确保尺寸正确
            const originalIframe = targetRef.current.querySelector('iframe');
            if (!originalIframe) {
                throw new Error('找不到预览内容');
            }
            const url = originalIframe.src;

            // 创建临时全屏 iframe，确保使用原始尺寸不受预览缩放影响
            const tempIframe = document.createElement('iframe');
            tempIframe.style.position = 'absolute';
            tempIframe.style.top = '-9999px';
            tempIframe.style.left = '-9999px';

            // 获取选中设备的配置，使用原始尺寸
            const device = devices.find(d => d.id === selectedDevice) || devices[0];
            tempIframe.style.width = `${device.width}px`;
            tempIframe.style.height = `${device.height}px`;
            tempIframe.style.border = 'none';
            tempIframe.style.transform = 'none'; // 确保没有缩放
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

                // 获取内容的实际高度
                const scrollHeight = Math.max(
                    iframeDocument.body.scrollHeight, 
                    iframeDocument.documentElement.scrollHeight,
                    iframeDocument.body.offsetHeight,
                    iframeDocument.documentElement.offsetHeight,
                    iframeDocument.body.clientHeight,
                    iframeDocument.documentElement.clientHeight,
                    device.height  // 默认设备高度作为最小值
                );

                // 适当的额外空间，但不会过多
                const exportHeight = scrollHeight;

                // 调整临时iframe高度以显示全部内容
                tempIframe.style.height = `${exportHeight}px`;
                
                // 再次等待以确保调整后的内容完全渲染
                await new Promise(resolve => setTimeout(resolve, 500));

                // 查找内容的实际底部位置
                const findLastVisibleElement = () => {
                    let maxBottom = 0;
                    
                    // 获取所有非空文本或包含内容的元素
                    const allElements = Array.from(iframeDocument.querySelectorAll('*'));
                    allElements.forEach(el => {
                        const element = el as HTMLElement;
                        if (element.offsetHeight > 0 && 
                            element.offsetWidth > 0 && 
                            window.getComputedStyle(element).display !== 'none') {
                            const bottom = element.offsetTop + element.offsetHeight;
                            if (bottom > maxBottom) {
                                maxBottom = bottom;
                            }
                        }
                    });
                    
                    return maxBottom > 0 ? maxBottom + 20 : exportHeight; // 添加小边距
                };

                const contentHeight = findLastVisibleElement();
                const finalHeight = Math.min(contentHeight, exportHeight);

                // 使用 html2canvas 捕获内容
                const canvas = await html2canvas(iframeDocument.body, {
                    allowTaint: true,
                    useCORS: true,
                    logging: false,
                    backgroundColor: '#ffffff',
                    width: device.width,
                    height: finalHeight,
                    scale: device.deviceScaleFactor || 1,
                    scrollY: 0,
                    scrollX: 0,
                    windowHeight: finalHeight,
                    onclone: (documentClone) => {
                        // 确保克隆的文档体现完整内容
                        const bodyClone = documentClone.querySelector('body');
                        if (bodyClone) {
                            bodyClone.style.height = `${finalHeight}px`;
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
                                if (computedStyle.height === '100%' || computedStyle.height === '100vh') {
                                    element.style.height = 'auto';
                                }
                            });
                        }
                        
                        // 设置HTML和文档元素样式
                        const htmlElement = documentClone.documentElement;
                        if (htmlElement) {
                            htmlElement.style.height = 'auto';
                            htmlElement.style.overflow = 'visible';
                        }
                    }
                });

                // 转换为图片并下载
                canvas.toBlob(blob => {
                    if (!blob) {
                        throw new Error('无法创建图片');
                    }
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `preview-${device.name}.png`;
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
        <div className='w-full flex gap-2'>
            <Select value={selectedDevice} onValueChange={onDeviceChange} disabled={disabled || isExporting}>
                <SelectTrigger className='w-[180px]'>
                    <SelectValue placeholder='选择设备' />
                </SelectTrigger>
                <SelectContent>
                    {devices.map(device => (
                        <SelectItem key={device.id} value={device.id}>
                            {device.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Button variant='default' onClick={handleExport} disabled={disabled || isExporting} className='flex-1'>
                <Download className={`h-4 w-4 mr-2 ${isExporting ? 'animate-pulse' : ''}`} />
                {isExporting ? '导出中...' : '导出图片'}
            </Button>
        </div>
    );
}

