FROM node:16.13.1-alpine3.15 AS builder
WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

FROM nginx:1.19-alpine AS server
COPY --from=builder ./app/build /usr/share/nginx/html