FROM node:18-alpine AS build-stage
WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build
