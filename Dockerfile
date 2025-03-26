FROM node:lts
WORKDIR /app
RUN npm install -g ts-node
RUN npm install -g  nodemon
COPY . .
RUN npm install
CMD ["npm", "run", "dev"]

