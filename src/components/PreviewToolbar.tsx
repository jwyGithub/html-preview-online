import React from 'react';
import ExportImage from './ExportImage';

interface PreviewToolbarProps {
    previewRef: React.RefObject<HTMLDivElement | null>;
    iframeUrl?: string;
    className?: string;
}

const PreviewToolbar: React.FC<PreviewToolbarProps> = ({ previewRef, iframeUrl, className = '' }) => {
    return (
        <div
            className={`preview-toolbar ${className}`}
            style={{
                display: 'flex',
                justifyContent: 'flex-end',
                padding: '12px',
                marginBottom: '12px',
                borderBottom: '1px solid #eee'
            }}
        >
            <ExportImage targetRef={previewRef} iframeUrl={iframeUrl} buttonText='导出为图片' filename='html-preview' scale={2} />
        </div>
    );
};

export default PreviewToolbar;

