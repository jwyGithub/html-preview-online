# 构建阶段
FROM node:20-alpine AS builder

# 设置工作目录
WORKDIR /app

# 全局安装pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# 复制package.json和pnpm-lock.yaml（如果存在）
COPY package.json pnpm-lock.yaml* ./

# 安装依赖并更新lock文件
RUN pnpm install

# 复制所有源代码
COPY . .

# 确保静态目录存在
RUN mkdir -p public

# 构建应用
RUN pnpm build

# 运行阶段
FROM node:20-alpine AS runner

# 全局安装pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# 设置工作目录
WORKDIR /app

# 设置环境变量
ENV NODE_ENV=production
ENV NEXT_PUBLIC_BASE_PATH=preview
ENV PORT=3000

# 复制package.json和pnpm-lock.yaml
COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./

# 安装仅生产环境需要的依赖
RUN pnpm install --prod

# 从构建阶段复制构建后的文件
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/public ./public

# 创建挂载点
# public目录 - 用于静态文件
VOLUME ["/app/public"]

# 暴露端口
EXPOSE 3000

# 启动命令 - 使用Next.js默认启动方式
CMD ["pnpm", "start"] 
