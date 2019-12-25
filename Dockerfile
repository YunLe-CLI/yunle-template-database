# 引用镜像
FROM node:10.15.3-alpine

# 作者
MAINTAINER sean

# 执行命令，创建文件夹
RUN mkdir -p /www

# 将Order目录拷贝到镜像里
ADD ./ /www

# 指定工作目录
WORKDIR /www

# 安装依赖及构建node应用
RUN npm config set registry https://registry.npm.taobao.org
RUN npm info underscore
RUN npm install
RUN echo Asia/Shanghai >/etc/timezone

# 将端口开放
EXPOSE 3000

# 容器启动命令
CMD ["npm", "run", "start"]
