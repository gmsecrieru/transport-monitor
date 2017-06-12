FROM node:7.10-slim

WORKDIR /tmp/build

COPY .babelrc .
COPY package.json .
RUN npm install

COPY ./src /tmp/build/src
RUN npm run build

WORKDIR /usr/src/app

RUN mv /tmp/build/node_modules /tmp/build/dist
RUN mv /tmp/build/dist /usr/src/app

CMD ["node", "dist/index.js"]
