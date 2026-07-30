# 🐳 Docker Guide - E-Store Backend

This guide explains how to build, run, publish, update, and deploy the
Docker image for the **E-Store** backend.

## Prerequisites

-   Docker Desktop / Docker Engine
-   Docker Hub account
-   `.env` file in the `server` directory

Project structure:

``` text
E-STORE/
├── client/
└── server/
    ├── Dockerfile
    ├── .dockerignore
    ├── .env
    ├── package.json
    └── server.js
```

## Build the image

``` bash
cd server
docker build -t estore-server .
```

Verify:

``` bash
docker images
```

## Run locally

``` bash
docker run --env-file .env -p 5000:5000 estore-server
```

Detached mode:

``` bash
docker run -d \
  --name estore-server \
  --restart unless-stopped \
  --env-file .env \
  -p 5000:5000 \
  estore-server
```

Logs:

``` bash
docker logs -f estore-server
```

Stop:

``` bash
docker stop estore-server
```

Remove:

``` bash
docker rm estore-server
```

## Push to Docker Hub

Login:

``` bash
docker login
```

Build with your repository name:

``` bash
docker build -t YOUR_DOCKERHUB_USERNAME/estore-server:1.0.0 .
docker tag YOUR_DOCKERHUB_USERNAME/estore-server:1.0.0 YOUR_DOCKERHUB_USERNAME/estore-server:latest
```

Push:

``` bash
docker push YOUR_DOCKERHUB_USERNAME/estore-server:1.0.0
docker push YOUR_DOCKERHUB_USERNAME/estore-server:latest
```

## Deploy on another machine

Login:

``` bash
docker login
```

Pull:

``` bash
docker pull YOUR_DOCKERHUB_USERNAME/estore-server:1.0.0
```

Create a `.env` file beside where you will run `docker run`.

Run:

``` bash
docker run -d \
  --name estore-server \
  --restart unless-stopped \
  --env-file .env \
  -p 5000:5000 \
  YOUR_DOCKERHUB_USERNAME/estore-server:1.0.0
```

## Updating the application

After changing the code:

``` bash
docker build -t YOUR_DOCKERHUB_USERNAME/estore-server:1.1.0 .
docker tag YOUR_DOCKERHUB_USERNAME/estore-server:1.1.0 YOUR_DOCKERHUB_USERNAME/estore-server:latest

docker push YOUR_DOCKERHUB_USERNAME/estore-server:1.1.0
docker push YOUR_DOCKERHUB_USERNAME/estore-server:latest
```

On the deployment server:

``` bash
docker pull YOUR_DOCKERHUB_USERNAME/estore-server:1.1.0

docker stop estore-server
docker rm estore-server

docker run -d \
  --name estore-server \
  --restart unless-stopped \
  --env-file .env \
  -p 5000:5000 \
  YOUR_DOCKERHUB_USERNAME/estore-server:1.1.0
```

## Roll back

``` bash
docker stop estore-server
docker rm estore-server

docker run -d \
  --name estore-server \
  --restart unless-stopped \
  --env-file .env \
  -p 5000:5000 \
  YOUR_DOCKERHUB_USERNAME/estore-server:1.0.0
```

## Useful commands

``` bash
docker ps
docker ps -a
docker images
docker image rm IMAGE_ID
docker container prune
docker image prune
docker system prune -a
```

## Best practices

-   Never commit `.env`.
-   Add `.env` to `.gitignore`.
-   Commit `.env.example`.
-   Tag releases (`1.0.0`, `1.1.0`) instead of relying only on `latest`.
-   Use `--restart unless-stopped` for production.
-   Rebuild the image whenever dependencies or source code change.
