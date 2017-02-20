FROM instructure/node-passenger:6

ARG prunedev=true

USER root

RUN apt-get update \
    && apt-get install -y redis-server \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

ENV NODE_ENV production
ENV PATH /usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/src/app/node_modules/.bin

ADD package.json /usr/src/app/package.json
ADD ./bin /usr/src/app/bin
ADD ./server /usr/src/app/server
ADD ./ui /usr/src/app/ui
ADD ./client /usr/src/app/client

# for legacy purposes
RUN ln -s /usr/src/app /app

RUN chown -R docker:docker /usr/src/app
USER docker

# to expose the application to passenger
RUN ln -s /usr/src/app/ui/public /usr/src/app/public
RUN ln -s /usr/src/app/server/index.js /usr/src/app/app.js

RUN NODE_ENV=dev npm install && \
    NODE_ENV=production node_modules/.bin/webpack -p --config ui/webpack.config.js && \
    NODE_ENV=production node_modules/.bin/webpack -p --config client/webpack.config.js && \
    if [ "$prunedev" = "true" ]; then npm prune --production; fi
