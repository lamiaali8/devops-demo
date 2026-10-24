
# Stage 1: Install dependencies and prepare the application
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY server.js ./
COPY views ./views
COPY public ./public

# Remove development dependencies from the prepared application
RUN npm prune --omit=dev


# Stage 2: Production runtime
FROM node:22-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=build /app/package.json ./
COPY --from=build /app/package-lock.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/server.js ./server.js
COPY --from=build /app/views ./views
COPY --from=build /app/public ./public

EXPOSE 3000

CMD ["npm", "start"]
FROM node:22-alpine
WORKDIR /app
COPY --from=build /app ./
EXPOSE 3000
CMD ["node", "server.js"]
