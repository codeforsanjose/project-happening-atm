FROM docker.io/library/node:14.21.3 as npm_cache_frontend
LABEL com.codeforsanjose.app="happening-atm"

WORKDIR /usr/src/app

COPY ./frontend/package*.json .
RUN npm install --from-lockfile

FROM docker.io/library/node:14.21.3
LABEL com.codeforsanjose.app="happening-atm"

WORKDIR /usr/src/app

ARG REACT_APP_GRAPHQL_URL

COPY ./frontend .

COPY --from=npm_cache_frontend /usr/src/app/node_modules /usr/src/app/node_modules

EXPOSE 3000/tcp

CMD [ "npm", "run", "start"]
