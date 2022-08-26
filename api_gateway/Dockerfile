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
WORKDIR /home/application/api_gateway_src
COPY api_gateway/package*.json ./
COPY api_gateway/tsconfig.json ./
RUN npm install --only=production
COPY api_gateway ./
RUN npm run build --only=production

# Run Service
FROM node:16-alpine as run-service
ENV NODE_ENV=prod
RUN npm install pm2 --location=global
COPY --from=build-common /home/application/common_library_src/dist /home/application/common_library
COPY --from=build-common /home/application/common_library_src/node_modules /home/application/common_library/node_modules
COPY --from=build-service /home/application/api_gateway_src/dist /home/application/api_gateway
COPY --from=build-service /home/application/api_gateway_src/node_modules /home/application/api_gateway/node_modules
WORKDIR /home/application/api_gateway
CMD ["pm2-runtime", "server.js"]
