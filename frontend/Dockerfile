FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

<<<<<<< HEAD
EXPOSE 4173
=======
EXPOSE 5173
>>>>>>> 71aac2d4a4c237d23ea07e656338615f9096f12e
