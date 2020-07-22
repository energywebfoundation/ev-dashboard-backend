# Check out https://hub.docker.com/_/node to select a new base image
FROM node:10-slim AS builder

# Some dependencies from package.json are installed from git
RUN apt-get update && apt-get upgrade -y && apt-get install -y git python3 build-essential

# Set to a non-root built-in user `node`
USER node

# Create app directory (with user `node`)
RUN mkdir -p /home/node/app

WORKDIR /home/node/app

# copy everything except from .dockerignore
COPY --chown=node . ./

# install dev dependencies as well
RUN npm install

# build in production mode
ENV NODE_ENV=production
RUN npm run clean && npm run build

# keep production dependencies only
RUN rm -rf node_modules
RUN npm install

FROM node:10-slim

RUN apt-get update && apt-get upgrade -y
# Set to a non-root built-in user `node`
USER node

# Create app directory (with user `node`)
RUN mkdir -p /home/node/app

WORKDIR /home/node/app

ENV NODE_ENV=production

COPY --from=builder /home/node/app/index.js ./
COPY --from=builder /home/node/app/dist ./dist
COPY --from=builder /home/node/app/public ./public
COPY --from=builder /home/node/app/node_modules ./node_modules

CMD ["node", "."]
