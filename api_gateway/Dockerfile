FROM node:16-alpine

# Copy common library
WORKDIR /home/node/common_library
COPY common_library ./

# Build common library
RUN ls -a
RUN npm install
RUN npm run build

# Copy api_gateway
WORKDIR /home/node/api_gateway
COPY api_gateway/ ./

# Build api_gateway
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
COPY --from=0 /home/node/common_library/dist .

# Copy api_gateway dist
WORKDIR /home/node/api_gateway
COPY api_gateway/resources ./resources
COPY api_gateway/package.json ./
COPY api_gateway/tsconfig.json ./
RUN npm install --only=production
COPY --from=0 /home/node/api_gateway/dist ./

ENV NODE_ENV=production

# Run api_gateway
RUN npm install pm2 --location=global
CMD ["pm2-runtime","server.js"]
