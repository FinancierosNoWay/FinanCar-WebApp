# Stage 1: Build Angular app
FROM node:16-alpine as build-step

RUN mkdir -p /app

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

RUN npm run build --configuration=production

# Stage 2: Serve Angular app with Nginx
FROM nginx:1.17.1-alpine

COPY --from=build-step /app/dist/trabajo-final /usr/share/nginx/html


