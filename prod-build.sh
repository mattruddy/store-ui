#!/usr/bin/env bash
docker-compose down
docker tag $(docker images mruddy/store-ui:latest -q) mruddy/store-ui:prev
docker build -t mruddy/store-ui:latest .
docker rmi $(docker images -f "dangling=true" -q) -f
docker push mruddy/store-ui:latest