FROM docker.io/library/node:lts

LABEL org.opensourcesanjose.app="happening-atm"

WORKDIR /usr/src/app

COPY ./backend/packages/graphql_api/package.json .

RUN npm install

EXPOSE 3000/tcp

CMD ["npx", "nodemon", "--legacy-watch", "."]
