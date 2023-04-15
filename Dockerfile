FROM node:19-alpine
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 4000
EXPOSE 9229