FROM docker.io/library/node:14.21.3 as node_modules_cache
LABEL com.codeforsanjose.app="happening-atm"

WORKDIR /usr/src/app

COPY ./backend/graphql_api/package*.json .
RUN npm install --from-lockfile

FROM docker.io/library/node:14.21.3
LABEL com.codeforsanjose.app="happening-atm"

WORKDIR /usr/src/app

COPY ./backend/graphql_api .

COPY --from=node_modules_cache /usr/src/app/node_modules /usr/src/app/node_modules

RUN npm install --from-lockfile 

EXPOSE 3000/tcp

CMD ["npm", "run", "start"]
