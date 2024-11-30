# Use an official Nginx image to serve the static files
FROM nginx:alpine

# Copy the build output to Nginx's default HTML directory
COPY build/ /usr/share/nginx/html

# Expose port 80 for the application
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
