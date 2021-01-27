# Check out https://hub.docker.com/_/node to select a new base image
FROM node:lts-slim AS builder

# Some dependencies from package.json are installed from git
RUN apt-get update && apt-get upgrade -y && apt-get install -y git python3 build-essential

# Set to a non-root built-in user `node`
USER node

# Create app directory (with user `node`)
RUN mkdir -p /home/node/app

WORKDIR /home/node/app

# copy everything except from .dockerignore
COPY --chown=node . ./

# install dev dependencies as well (unsafe-perm needed for ocn-bridge)
RUN npm config set unsafe-perm true 
RUN npm install

# build in production mode
ENV NODE_ENV=production
RUN npm run clean && npm run build

# keep production dependencies only
RUN npm prune --production
RUN sed -i 's/localhost/172\.16\.238\.10/g' node_modules/@shareandcharge/ocn-registry/dist/networks.js

FROM node:lts-slim

RUN apt-get update && apt-get upgrade -y
RUN apt-get install curl -y

# Set to a non-root built-in user `node`
USER node

# Create app directory (with user `node`)
RUN mkdir -p /home/node/app

WORKDIR /home/node/app

ENV NODE_ENV=production

COPY --from=builder /home/node/app/index.js ./
COPY --from=builder /home/node/app/dist ./dist
COPY --from=builder /home/node/app/node_modules ./node_modules
COPY --from=builder --chown=node /home/node/app/wait-for-node.sh ./
COPY --from=builder --chown=node /home/node/app/wait-for-node.dev.sh ./
COPY --from=builder --chown=node /home/node/app/inMemoryDB_EWFlex.default.json ./

RUN chmod +x ./wait-for-node.sh
RUN chmod +x ./wait-for-node.dev.sh

CMD ["node", "."]