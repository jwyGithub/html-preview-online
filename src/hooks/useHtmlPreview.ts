import { useState } from 'react';

export function useHtmlPreview() {
    const [htmlContent, setHtmlContent] = useState('');
    const [previewUrl, setPreviewUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generatePreview = async () => {
        if (!htmlContent) return;

        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch('/preview/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ html: htmlContent })
            });

            if (!response.ok) {
                throw new Error('生成预览失败');
            }

            const data = await response.json();
            setPreviewUrl(data.url);
        } catch (err) {
            console.error('Error:', err);
            setError('生成预览失败，请重试');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        htmlContent,
        setHtmlContent,
        previewUrl,
        isLoading,
        error,
        generatePreview
    };
}

