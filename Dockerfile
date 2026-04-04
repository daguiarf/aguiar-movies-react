FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 2109

ENV PORT=2109

CMD ["npm", "run", "dev"]
