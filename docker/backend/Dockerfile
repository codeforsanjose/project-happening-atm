FROM docker.io/library/node:14.21.3 as npm_cache_backend
LABEL com.codeforsanjose.app="happening-atm"

WORKDIR /usr/src/app

COPY ./backend/agenda_upload_service/package*.json .
RUN npm install --from-lockfile

FROM docker.io/library/node:14.21.3
LABEL com.codeforsanjose.app="happening-atm"

WORKDIR /usr/src/app

COPY ./backend/agenda_upload_service .

COPY --from=npm_cache_backend /usr/src/app/node_modules /usr/src/app/node_modules

EXPOSE 3000/tcp

CMD ["npm", "run", "start"]
