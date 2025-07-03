# Base image
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

# Install Nest CLI globally (optional but helpful)
RUN npm install -g @nestjs/cli

COPY . .

EXPOSE 3000

# Start Nest in watch mode
CMD ["npm", "run", "start:dev"]
