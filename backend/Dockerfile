FROM node:18-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    chromium \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV DOCKER=true

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000
EXPOSE 5001

CMD ["npm", "start"]