FROM node:22-alpine AS base
RUN corepack enable

FROM base AS build
WORKDIR /app
COPY package.json yarn.lock .yarnrc.yml turbo.json ./
COPY .yarn ./.yarn
COPY packages ./packages
COPY apps ./apps

RUN yarn install --immutable
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN yarn turbo run build --filter=@yugo/backoffice

FROM base AS deps
WORKDIR /app
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn
COPY packages ./packages
COPY apps ./apps
RUN yarn workspaces focus @yugo/backoffice --production

FROM base AS production
WORKDIR /app
ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/yarn.lock ./yarn.lock
COPY --from=build /app/.yarnrc.yml ./.yarnrc.yml
COPY --from=build /app/packages ./packages
COPY --from=build /app/apps/backoffice/build ./apps/backoffice/build
COPY --from=build /app/apps/backoffice/package.json ./apps/backoffice/package.json

EXPOSE 3000
CMD ["yarn", "workspace", "@yugo/backoffice", "start"]