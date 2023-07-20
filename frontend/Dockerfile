# syntax=docker/dockerfile:1
FROM node:18

WORKDIR /app

RUN npm i -g pnpm


COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

EXPOSE 3000

CMD [ "pnpm", "dev" ]