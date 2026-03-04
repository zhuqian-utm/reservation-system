FROM nginx:alpine

# Copy the Vite build output (from your Nx dist folder)
COPY dist/apps/web-client /usr/share/nginx/html

# Copy the custom Nginx config to replace the default
COPY apps/web-client/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]