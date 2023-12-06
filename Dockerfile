FROM node:lts
WORKDIR /NODE_AUTH_JWT
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]