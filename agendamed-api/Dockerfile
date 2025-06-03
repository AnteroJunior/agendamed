FROM node:23-bullseye AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

FROM node:23-bullseye AS production

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY .env ./

EXPOSE 3000

CMD ["node", "dist/src/main"]
