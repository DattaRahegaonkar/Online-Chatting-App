# Use a multi-staging build to reduce size of the image

# Stage - 1
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

# Stage - 2
FROM node:18-alpine

WORKDIR /app

ENV NODE_ENV=production

# Copy only what's needed for running the app
COPY --from=builder /app /app

EXPOSE 5001

CMD ["node", "src/index.js"]

