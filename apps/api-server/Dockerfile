# Step 1: Runtime
FROM node:20-alpine
WORKDIR /app

# Copy built files
COPY dist/apps/api-server .
COPY package.json pnpm-lock.yaml ./

# Install pnpm and dependencies
RUN npm install -g pnpm && pnpm install --prod

# --- ADD THIS LINE TO FIX THE ERROR ---
RUN pnpm add tslib
# --------------------------------------

EXPOSE 3000
CMD ["node", "main.js"]