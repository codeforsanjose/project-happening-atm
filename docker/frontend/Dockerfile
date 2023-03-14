FROM docker.io/library/node:14.21.3 as node_modules_cache
LABEL org.codeforsanjose.app="happening-atm"

WORKDIR /usr/src/app

COPY ./frontend/package*.json .
RUN npm install --from-lockfile

FROM docker.io/library/node:14.21.3
LABEL org.codeforsanjose.app="happening-atm"

WORKDIR /usr/src/app

ARG REACT_APP_GRAPHQL_URL

COPY ./frontend .

COPY --from=node_modules_cache /usr/src/app/node_modules /usr/src/app/node_modules

EXPOSE 3000/tcp

CMD [ "npm", "run", "start"]
