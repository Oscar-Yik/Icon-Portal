# Stage-1 & specify a name 'builder'
FROM  node:18.20.2-alpine AS builder

# Create a directory  and go to the directory 
WORKDIR /app

# Copy the package.json file to my current directory to install the necessary dependence  
COPY package.json .

# Install the dependence
RUN npm install

# Copy other files to my current directory
COPY . .

# Clear npm cache and build the application
RUN npm cache clean --force && npm run build

# Stage-2
FROM nginx:1.25.2-alpine-slim

# removing default nginx config file
RUN rm /etc/nginx/conf.d/default.conf

# copying our nginx config
COPY /default.conf /etc/nginx/conf.d/

# Copy the static file to my Nginx folder to serve static contain
COPY --from=builder /app/dist /usr/share/nginx/html

# download curl 
RUN apk --no-cache add curl

# Open the port to react
EXPOSE 80

# Run nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]