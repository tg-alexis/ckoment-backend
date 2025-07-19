FROM node:20.9.0-alpine as builder

ENV NODE_ENV build

USER root
WORKDIR /home/node

COPY package.json .
COPY pnpm-lock.yaml .

RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm add @prisma/client@latest
RUN npx prisma generate
RUN pnpm build

ENV NODE_ENV=production

# ---

FROM node:20.9.0-alpine

USER node
WORKDIR /home/node

COPY --from=builder --chown=node:node /home/node/package*.json ./
COPY --from=builder --chown=node:node /home/node/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /home/node/dist/ ./dist/

ENV HOST 0.0.0.0
ENV PORT 3000
EXPOSE ${PORT}

CMD ["node", "dist/main.js"]
