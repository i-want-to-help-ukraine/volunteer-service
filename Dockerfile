FROM node:16

WORKDIR /usr/src/app

ARG GITHUB_NPM_TOKEN

RUN npm install pm2 -g

COPY package*.json ./
COPY .npmrc ./
RUN npm config set '//npm.pkg.github.com/:_authToken' "${GITHUB_NPM_TOKEN}" && npm ci

COPY . .

RUN npm run prisma:generate
RUN npm run build
