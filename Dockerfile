FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Build Vite app
RUN npm run build

# Cloud Run expects port 8080
ENV PORT=8080
EXPOSE 8080

# Start server
CMD ["node", "server.js"]