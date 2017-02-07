FROM instructure/node-passenger:6

USER root

RUN apt-get update \
    && apt-get install -y redis-server \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

ADD package.json /usr/src/app/package.json
ADD ui/package.json /usr/src/app/ui/package.json
ADD client/package.json /usr/src/app/client/package.json

ENV NODE_ENV production

RUN cd /usr/src/app        && npm install
RUN cd /usr/src/app/ui     && npm install
RUN cd /usr/src/app/client && npm install

ADD ./bin /usr/src/app/bin
ADD ./app /usr/src/app/app
ADD ./ui /usr/src/app/ui
ADD ./client /usr/src/app/client

# to expose the application to passenger
RUN ln -s /usr/src/app/ui/public /usr/src/app/public
RUN ln -s /usr/src/app/app/app.js /usr/src/app/app.js

RUN cd /usr/src/app/ui && node ./node_modules/.bin/webpack -p
RUN cd /usr/src/app/client && node ./node_modules/.bin/webpack -p

RUN chown -R docker:docker /usr/src/app

ENV DATA_STORE FILE

USER docker
