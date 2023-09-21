FROM docker.io/library/node:14.21.3 as node_modules_cache
LABEL org.opensourcesanjose.app="happening-atm"
WORKDIR /usr/src/app
COPY ./frontend/package*.json .
RUN npm install --from-lockfile

FROM docker.io/library/node:14.21.3 as dev
LABEL org.opensourcesanjose.app="happening-atm"
WORKDIR /usr/src/app

COPY ./frontend .
COPY --from=node_modules_cache /usr/src/app/node_modules /usr/src/app/node_modules

EXPOSE 3000/tcp
CMD [ "npm", "run", "start"]

FROM dev as build
LABEL org.opensourcesanjose.app="happening-atm"
ARG PUBLIC_URL
ARG REACT_APP_GRAPHQL_URL
ARG REACT_APP_JWT_ISSUER
ARG REACT_APP_RECAPTCHAS_SITE_KEY
RUN npm run build

FROM nginx as prod
LABEL org.opensourcesanjose.app="happening-atm"
COPY docker/frontend/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/build /usr/share/nginx/html
EXPOSE 80/tcp
