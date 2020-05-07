#!/usr/bin/env bash
docker-compose down
docker tag $(docker images mruddy/store-fe-dev:latest -q) mruddy/store-fe-dev:prev
docker build -t mruddy/store-fe-dev:latest --build-arg env=dev .
docker rmi $(docker images -f "dangling=true" -q) -f
docker push mruddy/store-fe-dev:latest