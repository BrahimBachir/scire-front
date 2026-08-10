# Stage 1: Build the Angular application
FROM node:22-alpine AS build-stage

# Set the working directory
WORKDIR /app

# Copy package.json, package-lock.json, and .npmrc first to leverage Docker cache
COPY package*.json .npmrc ./

# Install dependencies (using npm ci for a clean, reproducible install)
RUN npm ci

# Copy the rest of the application files
COPY . .

# Build the Angular application in production mode
# Replace 'front' with the name of your Angular project (if a different name)
RUN npm run build -- --output-path=./dist/front --configuration=production

# Stage 2: Serve the application with Nginx
FROM nginx:alpine AS nginx-stage

# Copy the CORRECT and complete nginx.conf file
COPY nginx.conf /etc/nginx/nginx.conf

# Angular's application builder outputs to a 'browser' subfolder (dist/front/browser/index.html),
# not directly under dist/front - copy that subfolder so nginx's index.html actually gets overwritten.
COPY --from=build-stage /app/dist/front/browser /usr/share/nginx/html

# Expose port 80 to the host machine
EXPOSE 80

# Command to run Nginx when the container starts
CMD ["nginx", "-g", "daemon off;"]