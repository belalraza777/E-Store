# 🐳 Docker Cheat Sheet – E-Store Backend

## 1. Build the image

Run this after you make code changes.

```bash
cd server
docker build -t belal007/estore-server:latest .
```

Check the image:

```bash
docker images
```

---

## 2. Run the container

```bash
docker run -d \
  --name estore-server \
  --env-file .env \
  -p 5000:5000 \
  --restart unless-stopped \
  belal007/estore-server:latest
```

View logs:

```bash
docker logs -f estore-server
```

Stop:

```bash
docker stop estore-server
```

Remove:

```bash
docker rm estore-server
```

---

# 📤 Upload to Docker Hub

Login once:

```bash
docker login
```

Push the image:

```bash
docker push belal007/estore-server:latest
```

That's it.

---

# 🌍 Deploy on another server

Pull the image:

```bash
docker pull belal007/estore-server:latest
```

Create a `.env` file.

Run:

```bash
docker run -d \
  --name estore-server \
  --env-file .env \
  -p 5000:5000 \
  --restart unless-stopped \
  belal007/estore-server:latest
```

---

# 🔄 Update after changing code

Build the new image:

```bash
docker build -t belal007/estore-server:latest .
```

Push it:

```bash
docker push belal007/estore-server:latest
```

On the server:

```bash
docker pull belal007/estore-server:latest

docker stop estore-server
docker rm estore-server

docker run -d \
  --name estore-server \
  --env-file .env \
  -p 5000:5000 \
  --restart unless-stopped \
  belal007/estore-server:latest
```

---

# 🧹 Useful commands

See running containers:

```bash
docker ps
```

See all containers:

```bash
docker ps -a
```

See images:

```bash
docker images
```

Remove a container:

```bash
docker rm CONTAINER_NAME
```

Remove an image:

```bash
docker rmi IMAGE_NAME
```

Clean unused Docker resources:

```bash
docker system prune -a
```

---

# 📌 Remember

* **build** → Creates a Docker image.
* **run** → Starts a container from the image.
* **push** → Uploads the image to Docker Hub.
* **pull** → Downloads the image from Docker Hub.
* **stop** → Stops a running container.
* **rm** → Removes a container.
* **rmi** → Removes an image.

### Typical workflow

```text
Write Code
    ↓
docker build
    ↓
Test with docker run
    ↓
docker push
    ↓
Server: docker pull
    ↓
Server: docker run
```

This is the workflow you'll use for almost every Docker deployment.
