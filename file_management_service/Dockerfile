FROM node:16-alpine

# Copy common library
WORKDIR /home/node/common_library
COPY common_library ./

# Build common library
RUN ls -a
RUN npm install
RUN npm run build

# Copy file_management_service
WORKDIR /home/node/file_management_service
COPY file_management_service/ ./

# Build file_management_service
RUN ls -a
RUN npm install
RUN npm run build

# Copy common_library dist
FROM node:16-alpine
WORKDIR /home/node/common_library
COPY common_library/resources ./resources
COPY common_library/package.json ./
COPY common_library/tsconfig.json ./
RUN npm install --only=production
COPY --from=0 /home/node/common_library/dist ./

# Copy file_management_service dist
WORKDIR /home/node/file_management_service
COPY file_management_service/resources ./resources
COPY file_management_service/package.json ./
COPY file_management_service/tsconfig.json ./
RUN npm install --only=production
COPY --from=0 /home/node/file_management_service/dist ./


ENV NODE_ENV=production

# Run file_management_service
RUN npm install pm2 --location=global
CMD ["pm2-runtime","server.js"]
