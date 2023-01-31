FROM node:18-alpine

RUN mkdir /client
WORKDIR /client

COPY ./client .
RUN yarn install
RUN yarn run build

RUN mkdir /server
WORKDIR /server

COPY ./server .
RUN npm install

CMD [ "npm", "start" ]