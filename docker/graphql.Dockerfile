FROM  docker.io/library/node:14.21.3

WORKDIR /usr/src/app
COPY . .

RUN npm i

EXPOSE 3000

CMD ["npm", "start"]
