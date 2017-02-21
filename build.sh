#!/bin/bash

DC="docker-compose -f docker-compose.yml -f docker-compose.jenkins.yml"

echo "Building..."
$DC build web

echo "Starting..."
$DC up -d web

cleanup() {
  echo "Cleaning up..."
  $DC stop
  $DC rm -f
}
trap cleanup EXIT

echo "Installing modules..."
if ! $DC exec -T web npm install; then
  exit 1
fi

echo "Linting..."
if ! $DC exec -T web npm run eslint; then
  exit 1
fi

echo "Running tests..."
if ! $DC exec -T web npm run test:coverage; then
  exit 1
fi

echo "Copying coverage files from container $ID..."
docker cp $($DC ps -q web):/usr/src/app/coverage ./coverage
mv coverage/lcov-report/* coverage

echo "Done!"
