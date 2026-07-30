# Use the official Node.js 22 Alpine image.
# Alpine is a lightweight Linux distribution, making the image smaller.
FROM node:22-alpine

# Set the working directory inside the container.
# All following commands will run from /app.
WORKDIR /app

# Copy package.json and package-lock.json first.
# This lets Docker cache dependency installation if these files don't change.
COPY package*.json ./

# Install project dependencies.
# --legacy-peer-deps ignores peer dependency conflicts.
RUN npm install --legacy-peer-deps && \
    npm cache clean --force

# Copy the rest of the application source code.
COPY . .

# Document that the application listens on port 3000.
EXPOSE 3000

# Start the application.
# Change "server.js" if your project starts with a different file
# (e.g. app.js, index.js, src/server.js).
CMD ["node", "server.js"]