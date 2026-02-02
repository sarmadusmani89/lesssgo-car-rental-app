# Use Node 20 Alpine image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --force

# Copy the rest of the project
COPY . .

# Build the NestJS app
RUN npm run build

# Expose port 3001 (NestJS)
EXPOSE 3001

# Start the app
CMD ["npm", "run", "start:prod"]
