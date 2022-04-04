FROM python:3.10-slim-bullseye
ARG prunedev=true

ENV APP_HOME "/usr/src/app/"

USER root

RUN apt-get update \
    && apt-get install -y build-essential \
    && apt-get install -y redis-server \
    && apt-get install -y curl \
    && apt-get install -y ruby \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN curl -fsSL https://deb.nodesource.com/gpgkey/nodesource.gpg.key | gpg --dearmor | apt-key add - && \
  echo "deb https://deb.nodesource.com/node_16.x focal main" > /etc/apt/sources.list.d/nodesource.list && \
  apt-get update && \
  apt-get install -y --no-install-recommends nodejs && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/ && \
  npm install -g "npm@$NPM_VERSION" && \
  npm cache clean --force

ENV NODE_ENV production
ENV PATH /usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:${APP_HOME}node_modules/.bin

ADD package.json ${APP_HOME}package.json
ADD format_coverage.rb ${APP_HOME}format_coverage.rb
ADD .babelrc ${APP_HOME}.babelrc
ADD .eslintignore ${APP_HOME}.eslintignore
ADD .eslintrc ${APP_HOME}.eslintrc
ADD ./server ${APP_HOME}server
ADD ./ui ${APP_HOME}ui
ADD ./client ${APP_HOME}client

RUN addgroup --gid 9999 docker \
    && adduser --uid 9999 --gid 9999 --disabled-password --gecos "Docker User" docker \
    && usermod -L docker

WORKDIR ${APP_HOME}
RUN mkdir -p localdata coverage log tmp && chown -R docker:docker ${APP_HOME}

USER docker

RUN NODE_ENV=dev npm install --legacy-peer-deps && \
    NODE_ENV=production node_modules/.bin/webpack -p --config client/webpack.config.js && \
    NODE_ENV=production node_modules/.bin/webpack -p --config ui/webpack.config.js && \
    if [ "$prunedev" = "true" ]; then npm prune --legacy-peer-deps --production; fi

EXPOSE 80