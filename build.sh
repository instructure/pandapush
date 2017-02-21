#!/bin/bash

docker-compose run --rm web npm install
docker-compose run --rm webpack npm install
docker-compose run --rm web npm run eslint
docker-compose run --rm web npm test:coverage
