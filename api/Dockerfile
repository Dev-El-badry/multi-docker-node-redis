FROM node:alpine

WORKDIR '/app'
COPY ./package.json .
Run npm install
COPY . .
CMD ["npm", "run", "start"]