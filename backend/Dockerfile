FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source
COPY . .

# Remove test file
RUN rm -f testDb.js

EXPOSE 5000

CMD ["node", "server.js"]
