FROM node:20-alpine
WORKDIR /app
# Copiamos solo package.json si no hay lockfile
COPY package.json ./
RUN npm install --production
COPY app.js ./
ENV PORT=3000
EXPOSE 3000
CMD ["npm","start"]
