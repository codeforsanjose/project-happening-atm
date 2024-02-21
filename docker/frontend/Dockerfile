FROM docker.io/library/node:14.21.3 as node_modules_cache
LABEL org.opensourcesanjose.app="happening-atm"
WORKDIR /usr/src/app
COPY ./frontend/package*.json .
RUN npm install --from-lockfile

FROM docker.io/library/node:14.21.3 as local
LABEL org.opensourcesanjose.app="happening-atm"
WORKDIR /usr/src/app

COPY ./frontend .
COPY --from=node_modules_cache /usr/src/app/node_modules /usr/src/app/node_modules

EXPOSE 3000/tcp
CMD [ "npm", "run", "start"]

FROM local as build
LABEL org.opensourcesanjose.app="happening-atm"
ARG PUBLIC_URL
ARG REACT_APP_GRAPHQL_URL
RUN --mount=type=secret,id=REACT_APP_RECAPTCHAS_SITE_KEY \
    --mount=type=secret,id=REACT_APP_JWT_ISSUER \
    --mount=type=secret,id=REACT_APP_MICROSOFT_ID \
    --mount=type=secret,id=REACT_APP_GOOGLE_ID \
    --mount=type=secret,id=MICROSOFT_CLIENT_ID \
    REACT_APP_RECAPTCHAS_SITE_KEY=$(cat /run/secrets/REACT_APP_RECAPTCHAS_SITE_KEY) \
    REACT_APP_JWT_ISSUER=$(cat /run/secrets/REACT_APP_JWT_ISSUER) \
    REACT_APP_MICROSOFT_ID=$(cat /run/secrets/REACT_APP_MICROSOFT_ID) \
    REACT_APP_GOOGLE_ID=$(cat /run/secrets/REACT_APP_GOOGLE_ID) \
    MICROSOFT_CLIENT_ID=$(cat /run/secrets/MICROSOFT_CLIENT_ID) \
      npm run build



FROM nginx as nginx-build
LABEL org.opensourcesanjose.app="happening-atm"
COPY docker/frontend/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/build /usr/share/nginx/html
EXPOSE 80/tcp
