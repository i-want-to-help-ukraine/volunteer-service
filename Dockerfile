FROM node:16

WORKDIR /usr/src/app

ARG GITHUB_NPM_TOKEN

COPY package*.json ./
COPY .npmrc ./
RUN npm config set '//npm.pkg.github.com/:_authToken' "${GITHUB_NPM_TOKEN}" && npm install

COPY . .

RUN npm run prisma:generate
