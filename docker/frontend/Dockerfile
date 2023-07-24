FROM docker.io/library/node:14.21.3 as node_modules_cache
LABEL org.opensourcesanjose.app="happening-atm"

WORKDIR /usr/src/app

COPY ./frontend/package*.json .
RUN npm install --from-lockfile

FROM docker.io/library/node:14.21.3 as app
LABEL org.opensourcesanjose.app="happening-atm"

WORKDIR /usr/src/app

ARG PUBLIC_URL
ARG REACT_APP_GRAPHQL_URL
ARG REACT_APP_JWT_ISSUER

COPY ./frontend .

COPY --from=node_modules_cache /usr/src/app/node_modules /usr/src/app/node_modules

RUN npm run build

EXPOSE 3000/tcp

CMD [ "npm", "run", "start"]

FROM nginx as build

COPY --from=app /usr/src/app/build /usr/share/nginx/html

EXPOSE 80/tcp
