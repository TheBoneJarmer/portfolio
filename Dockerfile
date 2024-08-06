FROM node AS base

# Install deps
RUN npm install -g vite

# Copy the source files
COPY ./dist/ /app/

# Serve the website
WORKDIR /app/
ENTRYPOINT http-server -p 80 -c-1
