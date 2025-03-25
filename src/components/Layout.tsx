import React from 'react';

interface LayoutProps {
    children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
    return (
        <div className='min-h-screen h-screen bg-gray-50 dark:bg-gray-900 p-2 sm:p-3 flex flex-col overflow-hidden'>
            <div className='max-w-7xl mx-auto flex-1 flex flex-col overflow-hidden w-full'>
                <header className='mb-3 flex-shrink-0'>
                    <h1 className='text-2xl font-bold text-center text-gray-800 dark:text-white'>HTML 预览生成器</h1>
                    <p className='mt-1 text-center text-gray-600 dark:text-gray-300'>粘贴 HTML 代码，即时查看渲染效果</p>
                </header>

                <div className='flex-1 overflow-hidden flex flex-col'>
                    {children}
                </div>

                <footer className='mt-3 text-center text-xs text-gray-500 dark:text-gray-400 flex-shrink-0'>
                    HTML 预览生成器 &copy; {new Date().getFullYear()}
                </footer>
            </div>
        </div>
    );
}

