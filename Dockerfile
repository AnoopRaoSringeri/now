# Use the latest LTS version of Node.js
FROM node:23-slim as build

# Set the working directory inside the container
WORKDIR /app
 
# Copy package.json and package-lock.json
COPY package*.json ./

COPY yarn.lock ./
 
# Install dependencies
RUN yarn install
 
# Copy the rest of your application files
COPY . .
 
# # Expose the port your app runs on
# EXPOSE 4200
 
# # Define the command to run your app
# CMD ["yarn", "now"]

# Build the React app for production
RUN yarn run now-build

# # Use Nginx as the production server
# FROM nginx:alpine

# # Copy the built React app to Nginx's web server directory
# COPY --from=build /app/dist /usr/share/nginx/html
# ----------------------------------------------------------
# # Expose port 80 for the Nginx server
# EXPOSE 4200

# # # Start Nginx when the container runs
# # CMD ["nginx", "-g", "daemon off;"]

 
# # # Define the command to run your app
# CMD ["yarn", "now"]
# ----------------------------------------------------------
# Stage 2: Deploy
FROM node:alpine
WORKDIR /app
COPY --from=build /app .
EXPOSE 4200
CMD ["yarn", "now"]
# ----------------------------------------------------------
