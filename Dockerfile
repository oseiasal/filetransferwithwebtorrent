FROM node:21-bookworm AS builder

WORKDIR /app

COPY . /app

EXPOSE 3000

RUN npm install

CMD ["npm", "run", "dev"]
