FROM node:20
WORKDIR /NODE_AUTH_JWT
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]