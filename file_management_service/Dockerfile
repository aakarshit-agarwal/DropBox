FROM node:16-alpine as global-builder
ENV NODE_ENV=production
RUN npm install pm2 --location=global

# Build Common Library
FROM node:16-alpine as build-common
WORKDIR /home/application/common_library_src
COPY common_library/package*.json ./
COPY common_library/tsconfig.json ./
RUN npm install --only=production
WORKDIR /home/application/common_library_src
COPY common_library ./
RUN npm run build --only=production

# Build Service
FROM node:16-alpine as build-service
COPY --from=build-common /home/application/common_library_src/dist /home/application/common_library
WORKDIR /home/application/file_management_service_src
COPY file_management_service/package*.json ./
COPY file_management_service/tsconfig.json ./
RUN npm install --only=production
COPY file_management_service ./
RUN npm run build --only=production

# Run Service
FROM node:16-alpine as run-service
COPY --from=build-common /home/application/common_library_src/dist /home/application/common_library
COPY --from=build-service /home/application/file_management_service_src/dist /home/application/file_management_service
CMD ["pm2-runtime", "server.js"]
