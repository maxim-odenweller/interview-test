FROM node:24-alpine

# Install wget for healthcheck
RUN apk add --no-cache wget

WORKDIR /app

COPY package.json .
RUN npm install

COPY server.js .

EXPOSE 3000

CMD ["npm", "start"]

