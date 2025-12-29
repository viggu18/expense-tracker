# Multi-stage Dockerfile for React Native Expo Web
# This Dockerfile builds the web version of the Expo app

# Stage 1: Build the web app
FROM node:16 AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of the application code
COPY . .

# Build the web app
RUN npm run build

# Stage 2: Serve the web app
FROM nginx:alpine

# Copy built files from builder stage
COPY --from=builder /app/web-build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]