FROM node:19-alpine as ts-compiler
WORKDIR /app
COPY package*.json ./
COPY tsconfig*.json ./
RUN npm install
COPY ./src ./src
RUN rm -rf ./src/__tests__
COPY ./swagger ./swagger
RUN rm -rf ./dist
RUN npm run build

FROM node:19-alpine
WORKDIR /app
COPY --from=ts-compiler /app/node_modules ./node_modules
RUN npm prune --omit=dev
COPY --from=ts-compiler /app/ ./
ENV NODE_ENV=production
ENTRYPOINT [ "npm", "start" ]