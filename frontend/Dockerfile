FROM node:14 as builder

WORKDIR /app

COPY package*.json /app/
RUN npm install

COPY . /app
RUN npm run build

FROM openresty/openresty
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY ./nginx/nginx.conf /usr/local/openresty/nginx/conf/nginx.conf
COPY --from=builder /app/build /usr/local/openresty/nginx/html
EXPOSE 80
