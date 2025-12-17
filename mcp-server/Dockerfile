FROM node:24-alpine

# Install wget for healthcheck
RUN apk add --no-cache wget

WORKDIR /app

COPY package.json .
RUN npm install

# Copy files (will be overridden by volume mount in development)
COPY index.js .
COPY tools/ ./tools/
COPY nodemon.json .

EXPOSE 3001

CMD ["npm", "start"]

