FROM node:16.18.0-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# INSTALL MODULES
RUN npm install express cors

# RUN IN EXPRESS
ENTRYPOINT ["node", "express-serve.js"]