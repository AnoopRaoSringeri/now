# # Use the latest LTS version of Node.js
# FROM node:24-alpine AS build

# # Set the working directory inside the container
# WORKDIR /app
 
# # Copy package.json and package-lock.json
# COPY package*.json ./

# COPY yarn.lock ./
 
# # Install dependencies
# RUN yarn install
 
# # Copy the rest of your application files
# COPY . .
 
# # # Expose the port your app runs on
# # EXPOSE 4200
 
# # # Define the command to run your app
# # CMD ["yarn", "now"]

# # Build the React app for production
# RUN yarn run now-build

# # # Use Nginx as the production server
# # FROM nginx:alpine

# # # Copy the built React app to Nginx's web server directory
# # COPY --from=build /app/dist /usr/share/nginx/html
# # ----------------------------------------------------------
# # # Expose port 80 for the Nginx server
# # EXPOSE 4200

# # # # Start Nginx when the container runs
# # # CMD ["nginx", "-g", "daemon off;"]

 
# # # # Define the command to run your app
# # CMD ["yarn", "now"]
# # ----------------------------------------------------------
# # Stage 2: Deploy
# FROM node:alpine
# WORKDIR /app
# COPY --from=build /app .
# EXPOSE 4200
# CMD ["yarn", "now"]
# # ----------------------------------------------------------
# Stage 1: Build React app
FROM node:24-alpine AS build
WORKDIR /app

# Install deps
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy everything
COPY . .

# Build the React app (replace `dashboard` with your app name)
RUN yarn nx build now

# Stage 2: Serve with Nginx
# Production image for React
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
