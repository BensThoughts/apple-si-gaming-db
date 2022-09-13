# ** Required ENV vars on start **
# * DATABASE_URL - For prisma
# * SESSION_SECRET - For cookie-session
# * STEAM_API_KEY - For steam-api
# * DOMAIN - For passport

FROM node:slim as base
RUN apt-get update && apt-get install -y git
RUN npm i -g turbo

FROM base AS pruner
WORKDIR /app
COPY . .
RUN turbo prune --scope=@apple-si-gaming-db/remix-app --docker

FROM base AS installer
WORKDIR /app
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/yarn.lock ./yarn.lock
RUN yarn install

FROM base AS builder
WORKDIR /app
COPY --from=pruner /app/.git ./.git
COPY --from=pruner /app/out/full/ .
COPY --from=installer /app/ .
RUN turbo run build --filter=@apple-si-gaming-db/remix-app

FROM builder AS runner
# RUN addgroup --system --gid 1001 remix-app
# RUN adduser --system --uid 1001 remix-app
# USER db-stage
EXPOSE 3000
CMD ["yarn", "--cwd", "apps/remix-app", "start"]


