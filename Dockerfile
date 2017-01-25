FROM ubuntu:14.04

RUN apt-get update \
    && apt-get install -y nodejs npm git redis-server \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* \
    && sudo update-alternatives --install /usr/bin/node node /usr/bin/nodejs 10

WORKDIR /app

ADD package.json /app/package.json
ADD ui/package.json /app/ui/package.json
ADD client/package.json /app/client/package.json

ENV NODE_ENV production

RUN cd /app        && npm install
RUN cd /app/ui     && npm install
RUN cd /app/client && npm install

ADD ./bin /app/bin
ADD ./app /app/app
ADD ./ui /app/ui
ADD ./client /app/client

RUN cd /app/ui && nodejs ./node_modules/.bin/webpack -p
RUN cd /app/client && nodejs ./node_modules/.bin/webpack -p

RUN mkdir /home/docker \
  && useradd -d /home/docker docker \
  && chown -R docker:docker /home/docker /app

EXPOSE 3000

RUN mkdir -p /var/log/eb-app \
  && chown docker:docker /var/log/eb-app

ENV DATA_STORE FILE

USER docker

CMD nodejs /app/app/cluster.js
