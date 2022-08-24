FROM node:16-alpine as global-builder

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
WORKDIR /home/application/user_management_service_src
COPY user_management_service/package*.json ./
COPY user_management_service/tsconfig.json ./
RUN npm install --only=production
COPY user_management_service ./
RUN npm run build --only=production

# Run Service
FROM node:16-alpine as run-service
ENV NODE_ENV=production
RUN npm install pm2 --location=global
COPY --from=build-common /home/application/common_library_src/dist /home/application/common_library
COPY --from=build-common /home/application/common_library_src/node_modules /home/application/common_library/node_modules
COPY --from=build-service /home/application/user_management_service_src/dist /home/application/user_management_service
COPY --from=build-service /home/application/user_management_service_src/node_modules /home/application/user_management_service/node_modules
WORKDIR /home/application/user_management_service
CMD ["pm2-runtime", "server.js"]
