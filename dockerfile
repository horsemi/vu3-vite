FROM nginx
COPY dist/ /usr/share/nginx/html/
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# FROM node
# COPY node_server/ /app/
# COPY dist/ /app/dist/
# RUN mkdir -p /data/logs/4pl && chmod -R 777 /data/logs/4pl
# WORKDIR /app
# RUN npm install --production
# RUN npm install pm2@4.2.1 -g
# RUN npm run pm2-logrotate
# EXPOSE 80
# CMD pm2-runtime start ecosystem.config.js