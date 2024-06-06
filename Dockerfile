FROM nginx:latest
WORKDIR /usr/share/nginx/html
COPY dist/trabajo-final .
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
