FROM node:12-alpine
WORKDIR /usr/src/app
COPY . .
RUN yarn install --force
RUN yarn build
EXPOSE ${PORT}
