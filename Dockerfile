FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy package manifests first for efficient layer caching
COPY package*.json ./

# Install production dependencies
RUN npm install --only=production

# Copy application source files
COPY . .

# Expose server port
EXPOSE 8080

# Set default environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Command to launch the application
CMD ["npm", "start"]
