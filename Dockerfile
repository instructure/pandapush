FROM instructure/node-passenger:16

ARG prunedev=true

ENV APP_HOME "/usr/src/app"

USER root

RUN apt-get update \
    && apt-get install -y redis-server \
    && apt-get install -y libpython3.8 \
    && apt-get install -y build-essential \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

ENV NODE_ENV production
ENV PATH /usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:${APP_HOME}/node_modules/.bin

ADD package.json ${APP_HOME}/package.json
ADD format_coverage.rb ${APP_HOME}/format_coverage.rb
ADD .babelrc ${APP_HOME}/.babelrc
ADD .eslintignore ${APP_HOME}/.eslintignore
ADD .eslintrc ${APP_HOME}/.eslintrc
ADD ./server ${APP_HOME}/server
ADD ./ui ${APP_HOME}/ui
ADD ./client ${APP_HOME}/client

RUN mkdir -p localdata coverage log tmp && chown -R docker:docker ${APP_HOME}

USER docker

# to expose the application to passenger
RUN ln -s ${APP_HOME}/ui/public ${APP_HOME}/public
RUN ln -s ${APP_HOME}/server/index.js ${APP_HOME}/app.js

RUN NODE_ENV=dev npm install --legacy-peer-deps --python=/usr/bin/python3 \
    && NODE_ENV=production node_modules/.bin/webpack -p --config client/webpack.config.js \
    && NODE_ENV=production node_modules/.bin/webpack -p --config ui/webpack.config.js \
    && if [ "$prunedev" = "true" ]; then npm prune --legacy-peer-deps --production; fi
