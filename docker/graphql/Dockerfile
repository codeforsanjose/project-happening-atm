FROM docker.io/library/node:14.21.3 as npm_cache_graphql
LABEL com.codeforsanjose="gov-agenda-notifier"

WORKDIR /usr/src/app

COPY ./backend/graphql_api/package*.json .
RUN npm install --from-lockfile

FROM docker.io/library/node:14.21.3
LABEL com.codeforsanjose="gov-agenda-notifier"

WORKDIR /usr/src/app

COPY ./backend/graphql_api .

COPY --from=npm_cache_graphql /usr/src/app/node_modules /usr/src/app/node_modules

EXPOSE 3000/tcp

CMD ["npm", "run", "start"]
