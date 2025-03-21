'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Expand } from 'lucide-react';
import { useRef } from 'react';
import { ExportImage } from '@/components/ExportImage';

interface PreviewAreaProps {
    previewUrl?: string;
    onExpand: () => void;
}

export function PreviewArea({ previewUrl, onExpand }: PreviewAreaProps) {
    const previewRef = useRef<HTMLDivElement | null>(null);

    return (
        <Card className='flex flex-col h-full'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle>预览</CardTitle>
                <Button variant='ghost' size='icon' onClick={onExpand} disabled={!previewUrl} title='全屏预览'>
                    <Expand className='h-4 w-4' />
                </Button>
            </CardHeader>
            <CardContent className='flex-1 min-h-0' ref={previewRef}>
                {previewUrl ? (
                    <iframe src={previewUrl} className='w-full h-full border-0' title='Preview' />
                ) : (
                    <div className='flex items-center justify-center h-full text-muted-foreground'>
                        点击&quot;生成预览&quot;按钮查看效果
                    </div>
                )}
            </CardContent>
            <CardFooter>
                <ExportImage targetRef={previewRef} disabled={!previewUrl} />
            </CardFooter>
        </Card>
    );
}

