FROM node:20
WORKDIR /NODE_AUTH_JWT
COPY package*.json ./
RUN npm install
COPY . .
ENV DB_USER=keystore \
    DB_PASS=Ad4hjZOohoM74iIG \
    SECRET=JSJDAAMFKJAUFMCKOPOAKCIKJOA@%&$JNASJNDsdaasfasfc$%$@
EXPOSE 3000
CMD ["npm", "start"]