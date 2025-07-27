FROM nginx:alpine

COPY /dist /usr/share/nginx/html
COPY /public /usr/share/nginx/html/public

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]