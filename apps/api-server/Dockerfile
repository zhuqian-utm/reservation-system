# Stage 1: Build the application
FROM node:20-alpine AS builder
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy lockfiles and install ALL dependencies (including devDeps for building)
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy the entire monorepo source
COPY . .

# Build only the api-server (Adjust the command based on your project.json)
RUN npx nx build api-server --prod

# Stage 2: Production Runtime
FROM node:20-alpine AS production

# Create a non-privileged user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001 -G nodejs

WORKDIR /app

# Copy only the compiled code from the builder stage
# Note: Nx output path is usually dist/apps/api-server
COPY --from=builder --chown=nestjs:nodejs /app/dist/apps/api-server ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Switch to the non-root user
USER nestjs

EXPOSE 3000

# Run the compiled main file
CMD ["node", "dist/main.js"]