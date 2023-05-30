# Aquasensor : Production image


# Server (backend) compilation image
FROM node:19-alpine as server-compiler

LABEL maintainer="Nicolas JACQUEMIN"

WORKDIR /app

COPY server/package*.json ./
COPY server/tsconfig*.json ./

RUN npm install
RUN npm install -g typescript

COPY server/src ./src

RUN rm -rf ./src/__tests__
RUN npm run build && npm prune --omit=dev


# WebApp (frontend) compilation image
FROM node:19-alpine as webapp-builder

LABEL maintainer="Nicolas JACQUEMIN"

WORKDIR /app

RUN apk update && apk upgrade
RUN apk add git

COPY webapp/package.json /app/

RUN npm install

COPY webapp/ .

RUN npm run generate && npm prune --omit=dev

# Aquasensor Runner image

FROM ubuntu:latest as runner

LABEL maintainer="Nicolas JACQUEMIN"

WORKDIR /app

# Install dependencies

RUN apt-get update && apt-get install -y \
    curl \
    nginx
RUN apt-get install gnupg -y &&\
curl -fsSL https://pgp.mongodb.com/server-6.0.asc | \
   gpg -o /usr/share/keyrings/mongodb-server-6.0.gpg \
   --dearmor &&\
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-6.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-6.0.list
RUN apt-get update && apt-get install -y mongodb-org
RUN curl -fsSL https://deb.nodesource.com/setup_19.x | bash - &&\
apt-get install -y nodejs
RUN apt-get install -y redis-server
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy compiled files

RUN mkdir -p /app/webapp/dist && mkdir -p /app/server/dist

COPY --from=webapp-builder /app/dist /app/webapp/dist

COPY --from=server-compiler /app/package*.json /app/server/
COPY --from=server-compiler /app/dist /app/server/dist

# Configure nginx
COPY production/nginx.conf /etc/nginx/nginx.conf
RUN mkdir -p /run/nginx
RUN chown -R www-data:www-data /run/nginx
EXPOSE 80

COPY production/start.sh .
RUN chmod +x start.sh

ENV MONGODB_URI = mongodb://user:password@localhost
ENV REDIS_HOST = localhost

ENTRYPOINT ["./start.sh"]