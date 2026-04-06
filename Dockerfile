# --- Stage 1: Build ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copy only files needed to install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your code and build the NestJS project
COPY . .
RUN npm run build

# --- Stage 2: Runtime ---
FROM node:20-alpine

WORKDIR /app

# Only copy the production-ready files from the builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

# Install ONLY production dependencies (no devDependencies)
RUN npm install --only=production

# Cloud Run usually injects a PORT variable, default to 8080
EXPOSE 8080

CMD ["node", "dist/src/main"]