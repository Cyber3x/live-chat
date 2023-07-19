# syntax=docker/dockerfile:1
FROM node:18

WORKDIR /app

RUN npm i -g pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

RUN pnpm build

EXPOSE 4000
EXPOSE 5432

CMD [ "node", "build/index.js" ]