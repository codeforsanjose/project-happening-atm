FROM docker.io/library/node:lts-alpine3.21 AS node_modules_cache
LABEL org.opensourcesanjose.app="happening-atm"

WORKDIR /usr/src/app

COPY ./backend/packages/graphql_api/package*.json .
RUN npm install --from-lockfile

FROM docker.io/library/node:lts-alpine3.21
LABEL org.opensourcesanjose.app="happening-atm"

WORKDIR /usr/src/app

COPY ./backend/packages/graphql_api .

COPY --from=node_modules_cache /usr/src/app/node_modules /usr/src/app/node_modules

EXPOSE 3000/tcp

CMD ["npm", "run", "start"]
