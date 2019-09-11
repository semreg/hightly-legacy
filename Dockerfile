FROM node:8

RUN curl -o- -L https://yarnpkg.com/install.sh | bash

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

COPY package*.json /usr/src/app

RUN yarn install-all

COPY . /usr/src/app

EXPOSE 5000

CMD ["yarn", "start"]
