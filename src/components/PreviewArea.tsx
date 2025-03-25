'use client';

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useRef, useState, useEffect } from 'react';
import { ExportImage } from '@/components/ExportImage';
import { devices } from '@/config/devices';

interface PreviewAreaProps {
    previewUrl?: string;
}

export function PreviewArea({ previewUrl }: PreviewAreaProps) {
    const previewRef = useRef<HTMLDivElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [selectedDevice, setSelectedDevice] = useState<string>(devices[0].id);
    const device = devices.find(d => d.id === selectedDevice) || devices[0];
    const [scale, setScale] = useState(1);

    // 计算适合的缩放比例
    useEffect(() => {
        if (!containerRef.current) return;

        const updateScale = () => {
            const container = containerRef.current;
            if (!container) return;

            // 考虑内边距
            const containerWidth = container.clientWidth - 32; // 减小内边距考虑
            const containerHeight = container.clientHeight - 32;

            if (device.isMobile) {
                // 设置缩放比例，确保完全可见
                const horizontalScale = containerWidth / device.width;
                const verticalScale = containerHeight / device.height;
                const newScale = Math.min(horizontalScale, verticalScale, 1); // 不放大，只缩小

                setScale(Math.max(0.3, newScale)); // 设置最小缩放比例为0.3
            } else {
                setScale(1); // 桌面设备不缩放
            }
        };

        updateScale();
        window.addEventListener('resize', updateScale);

        return () => {
            window.removeEventListener('resize', updateScale);
        };
    }, [device, containerRef]);

    return (
        <Card className='flex flex-col h-full'>
            <CardHeader className='py-2 px-4'>
                <CardTitle>预览</CardTitle>
            </CardHeader>
            <CardContent ref={containerRef} className='flex-1 min-h-0 bg-gray-100 flex items-center justify-center overflow-auto p-4'>
                <div ref={previewRef} className='h-full w-full flex items-center justify-center'>
                    {previewUrl ? (
                        <div
                            className='bg-white shadow-lg overflow-hidden relative'
                            style={{
                                width: device.isMobile ? `${device.width}px` : '100%',
                                height: device.isMobile ? `${device.height}px` : '100%',
                                transform: `scale(${scale})`,
                                transformOrigin: 'center',
                                transition: 'all 0.3s ease',
                                ...(device.isMobile
                                    ? {
                                          borderRadius: '36px',
                                          boxShadow: '0 0 0 6px #e0e0e0, 0 0 0 6.5px #f0f0f0',
                                          backgroundColor: '#f5f5f5',
                                          padding: '3px',
                                          margin: '0 auto',
                                          maxWidth: 'unset',
                                          maxHeight: 'unset'
                                      }
                                    : {
                                          maxWidth: '100%',
                                          maxHeight: '100%',
                                          margin: '0'
                                      })
                            }}
                        >
                            {device.isMobile && (
                                <div
                                    className='absolute top-0 left-1/2 -translate-x-1/2 w-[20%] h-[20px] bg-[#e0e0e0] rounded-b-xl'
                                    style={{
                                        boxShadow: 'inset 0 0 4px rgba(0,0,0,0.2)'
                                    }}
                                />
                            )}
                            <div className={device.isMobile ? 'w-full h-full rounded-[44px] overflow-hidden' : ''}>
                                <iframe
                                    src={previewUrl}
                                    className='w-full h-full border-0'
                                    title='Preview'
                                    sandbox='allow-scripts'
                                    style={{
                                        backgroundColor: '#fff'
                                    }}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className='flex items-center justify-center h-full text-muted-foreground'>
                            点击&quot;生成预览&quot;按钮查看效果
                        </div>
                    )}
                </div>
            </CardContent>
            <CardFooter className='py-2 px-4'>
                <ExportImage
                    targetRef={previewRef}
                    disabled={!previewUrl}
                    selectedDevice={selectedDevice}
                    onDeviceChange={setSelectedDevice}
                />
            </CardFooter>
        </Card>
    );
}

