FROM ubuntu:14.04

RUN apt-get update
RUN apt-get install -y nodejs npm git

WORKDIR /app

ADD package.json /app/package.json
ADD ui/package.json /app/ui/package.json

RUN cd /app    && npm install
RUN cd /app/ui && npm install

ADD ./bin /app/bin
ADD ./app /app/app
ADD ./ui /app/ui

ENV NODE_ENV production
RUN cd /app/ui && nodejs ./node_modules/.bin/webpack -p

VOLUME [ "/app/localdata" ]
EXPOSE 3000

RUN mkdir -p /var/log/eb-app
ENV DATA_STORE FILE

CMD nodejs /app/app/server.js
