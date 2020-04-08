### STAGE 1: Build ###
FROM node:11-alpine as build
RUN mkdir /app
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
ENV NPM_CONFIG_LOGLEVEL warn
COPY package*.json /app/
RUN npm config set unsafe-perm true
RUN npm install --silent
COPY . /app
RUN npm run build

### STAGE 2: Production Environment ###
FROM nginx:1.14-alpine
COPY --from=build /app/build /usr/share/nginx/html
RUN chmod -R 755 /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d