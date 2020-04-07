NODE_ENV=dev docker-compose run --rm web npm install
NODE_ENV=dev docker-compose run --rm webpack npm install
docker-compose up
