FROM node:18-alpine
LABEL maintainer="A1ex"

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .
RUN npx prisma generate

CMD [ "npm", "run", "start:docker" ]