'use client';

import { useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { CodeEditor } from '@/components/CodeEditor';
import { PreviewArea } from '@/components/PreviewArea';
import { useHtmlPreview } from '@/hooks/useHtmlPreview';

export default function Home() {
  const { 
    htmlContent, 
    setHtmlContent, 
    previewUrl, 
    isLoading, 
    error, 
    generatePreview 
  } = useHtmlPreview();
  
  // 解决iOS Safari上的回弹问题
  useEffect(() => {
    // 防止iOS Safari的橡皮筋效果
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    };
  }, []);

  // 如果出现错误，显示错误信息
  if (error) {
    alert(error);
  }

  return (
    <Layout>
      <div className='flex flex-col lg:flex-row gap-3 h-[calc(100vh-136px)] overflow-hidden'>
        {/* 左侧输入区域 */}
        <div className='w-full lg:w-1/2 flex flex-col overflow-hidden'>
          <CodeEditor 
            value={htmlContent}
            onChange={setHtmlContent}
            onGenerate={generatePreview}
            isLoading={isLoading}
          />
        </div>

        {/* 右侧预览区域 */}
        <div className='w-full lg:w-1/2 flex flex-col overflow-hidden'>
          <PreviewArea previewUrl={previewUrl} />
        </div>
      </div>
    </Layout>
  );
}

