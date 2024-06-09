From node:20
WORKDIR /user/src/app    

COPY package*.json ./


RUN npm install 

RUN npm run build 

USER node
EXPOSE 3001
CMD ["npm","run","start:prod"]