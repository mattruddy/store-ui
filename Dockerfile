### PROD Build ###
FROM node:11-alpine as build
WORKDIR /app
ENV NPM_CONFIG_LOGLEVEL warn
COPY . .
RUN npm install --silent
RUN npm install workbox-cli --global --silent
RUN npm run build
RUN workbox injectManifest

### STAGE 2: Production Environment ###
FROM nginx:1.14-alpine
COPY --from=build /app/build /usr/share/nginx/html
RUN chmod -R 755 /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
ARG env=prod
COPY /nginx/${env}/nginx.conf /etc/nginx/conf.d