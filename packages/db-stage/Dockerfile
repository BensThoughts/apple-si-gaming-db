FROM node:alpine AS builder
RUN apk update
WORKDIR /app
RUN yarn global add turbo
COPY . .
RUN turbo prune --scope=@apple-si-gaming-db/db-stage --docker

FROM node:alpine AS installer
RUN apk update
WORKDIR /app

COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock
RUN yarn install

COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json
RUN yarn turbo run build --filter=@apple-si-gaming=db/db-stage

FROM node:alpine AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 db-stage
RUN adduser --system --uid 1001 db-stage
USER db-stage
COPY --from=installer /app .

CMD node apps/db-stage/dist/index.js
