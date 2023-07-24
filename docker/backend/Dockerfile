FROM docker.io/library/node:14.21.3 as node_modules_cache
LABEL org.opensourcesanjose.app="happening-atm"

WORKDIR /usr/src/app

COPY ./backend/agenda_upload_service/package*.json .
RUN npm install --from-lockfile

FROM docker.io/library/node:14.21.3
LABEL org.opensourcesanjose.app="happening-atm"

WORKDIR /usr/src/app

COPY ./backend/agenda_upload_service .

COPY --from=node_modules_cache /usr/src/app/node_modules /usr/src/app/node_modules

EXPOSE 3000/tcp

CMD ["npm", "run", "start"]
