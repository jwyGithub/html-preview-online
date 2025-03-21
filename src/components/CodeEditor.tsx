'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ChangeEvent } from 'react';

interface CodeEditorProps {
    value: string;
    onChange: (value: string) => void;
    onGenerate: () => void;
    isLoading: boolean;
}

export function CodeEditor({ value, onChange, onGenerate, isLoading }: CodeEditorProps) {
    return (
        <Card className='flex flex-col h-full'>
            <CardHeader>
                <CardTitle>HTML 代码</CardTitle>
            </CardHeader>
            <CardContent className='flex-1 min-h-0'>
                <Textarea
                    value={value}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
                    className='w-full h-full min-h-[300px] font-mono resize-none'
                    placeholder='在此输入 HTML 代码...'
                />
            </CardContent>
            <CardFooter>
                <Button onClick={onGenerate} disabled={isLoading} className='w-full'>
                    {isLoading ? '生成预览中...' : '生成预览'}
                </Button>
            </CardFooter>
        </Card>
    );
}

