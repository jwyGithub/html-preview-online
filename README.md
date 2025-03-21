# HTML Preview Online

一个在线 HTML 预览工具，支持实时预览 HTML 代码并导出为图片。

## 功能特点

-   ✨ 实时预览 HTML 代码
-   🖼️ 支持导出预览内容为图片
-   🔍 全屏预览模式
-   🎨 美观的用户界面
-   🚀 基于 Next.js 构建，性能优异

## 快速开始

首先，克隆项目并安装依赖：

```bash
git clone https://github.com/yourusername/html-preview-online.git
cd html-preview-online
npm install
```

然后，运行开发服务器：

```bash
npm run dev
# 或者
yarn dev
# 或者
pnpm dev
# 或者
bun dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 即可查看效果。

## 使用说明

1. 在左侧编辑器中输入 HTML 代码
2. 点击"生成预览"按钮查看实时效果
3. 可以点击右上角的展开按钮进入全屏预览模式
4. 使用导出按钮可以将预览内容保存为图片

## 技术栈

-   [Next.js](https://nextjs.org) - React 框架
-   [Tailwind CSS](https://tailwindcss.com) - 样式框架
-   [Shadcn/ui](https://ui.shadcn.com) - UI 组件库
-   [html2canvas](https://html2canvas.hertzen.com) - HTML 导出图片

## 开发

项目使用 [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) 自动优化并加载 [Geist](https://vercel.com/font) 字体。

## 部署

推荐使用 [Vercel 平台](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) 部署，它是 Next.js 的创建者提供的托管服务。

更多部署相关信息，请查看 [Next.js 部署文档](https://nextjs.org/docs/app/building-your-application/deploying)。

## 许可证

MIT

