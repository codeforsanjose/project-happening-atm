FROM  docker.io/library/node:14.21.3 as base

WORKDIR /usr/src/app

ARG REACT_APP_GRAPHQL_URL
ARG FRONTEND_FOLDER=./frontend

# COPY package*.json /app/
# RUN npm install --from-lockfile 

COPY $FRONTEND_FOLDER /app

CMD [ "npm", "start" ]

FROM  base as build
RUN npm run dev

FROM openresty/openresty as nginx
COPY ./docker/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY ./docker/nginx/nginx.conf /usr/local/openresty/nginx/conf/nginx.conf
COPY --from=build /app/build /usr/local/openresty/nginx/html
EXPOSE 80
