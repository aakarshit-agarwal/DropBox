FROM node:16-alpine

# Copy common library
#RUN mkdir -p /home/node/common_library && chown -R node:node /home/node/common_library
WORKDIR /home/node/common_library
COPY common_library/.env.production ./
COPY common_library/package.json ./
COPY common_library/tsconfig.json ./
COPY common_library ./

RUN ls -a
RUN npm install
RUN npm run build

#RUN mkdir -p /home/node/user_management && chown -R node:node /home/node/user_management
WORKDIR /home/node/user_management_service
COPY user_management_service/package.json ./
COPY user_management_service/tsconfig.json ./
COPY user_management_service/src ./src

RUN ls -a
RUN npm install
RUN npm run build

## this is stage two , where the app actually runs
FROM node:16-alpine
WORKDIR /home/node/common_library
COPY common_library/.env.production ./
COPY common_library/package.json ./
COPY common_library/tsconfig.json ./
COPY common_library ./
RUN npm install --only=production
COPY --from=0 /home/node/common_library/dist .

WORKDIR /home/node/user_management_service
COPY common_library/.env.production ./
COPY user_management_service/package.json ./
COPY user_management_service/tsconfig.json ./
RUN npm install --only=production
COPY --from=0 /home/node/user_management_service/dist .

RUN npm install pm2 -g
EXPOSE 80
CMD ["node", "server.js"]
#CMD ["pm2-runtime","server.js"]
