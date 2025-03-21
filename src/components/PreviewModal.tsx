'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface PreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    previewUrl?: string;
}

export function PreviewModal({ isOpen, onClose, previewUrl }: PreviewModalProps) {
    if (!previewUrl) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className='max-w-[95vw] max-h-[95vh] w-[95vw] h-[95vh] p-0'>
                <div className='flex flex-col h-full'>
                    <DialogHeader className='p-4 border-b'>
                        <DialogTitle>预览</DialogTitle>
                    </DialogHeader>
                    {/* 预览区域 */}
                    <div className='flex-1 min-h-0 p-4'>
                        <iframe src={previewUrl} className='w-full h-full border-0 rounded-md' title='Preview' sandbox='allow-scripts' />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

