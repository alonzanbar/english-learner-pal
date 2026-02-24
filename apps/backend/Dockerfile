# Build from repo root: docker build -f apps/backend/Dockerfile .
FROM node:20-alpine
WORKDIR /app

COPY apps/backend/package.json ./
RUN npm install --omit=dev

COPY apps/backend/src ./src

ENV PORT=8080
EXPOSE 8080
CMD ["node", "src/index.js"]
