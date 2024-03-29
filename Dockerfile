FROM node:16-bullseye-slim as base
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
  tini \
  && rm -rf /var/lib/apt/lists/*
RUN npm i -g pnpm@7.19.0
EXPOSE 8000
RUN mkdir /app && chown -R node:node /app
WORKDIR /app
USER node
COPY --chown=node:node package.json pnpm-lock.yaml ./
ENV CI true
RUN pnpm i && pnpm store prune

FROM base as source
COPY --chown=node:node . .

FROM source as integration-test
ENV NODE_ENV=test
ENV PATH=/app/node_modules/.bin:$PATH
RUN pnpm i && pnpm store prune
RUN pnpm prisma generate
RUN pnpm eslint .
ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["pnpm", "integration-test:ci"]

FROM source as production
RUN pnpm build
ENV NODE_ENV=production
ENV PATH=/app/node_modules/.bin:$PATH
RUN pnpm i && pnpm store prune
RUN pnpm prisma generate
ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["node", "./dist/server.js"]
