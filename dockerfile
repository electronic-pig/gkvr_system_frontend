# 使用 Nginx 作为基础镜像来提供静态文件服务
FROM nginx:alpine

# 将构建好的静态文件复制到 Nginx 默认的静态文件目录
COPY dist /usr/share/nginx/html

# 将自定义的nginx.conf复制到Nginx的配置目录
COPY nginx.conf /etc/nginx/nginx.conf

# 暴露端口
EXPOSE 80

# 启动 Nginx 服务
CMD ["nginx", "-g", "daemon off;"]
