# Multi-stage build for backend  
FROM node:18-slim AS builder

WORKDIR /app

# Install OpenSSL and other required dependencies for Prisma
RUN apt-get update && apt-get install -y openssl libssl3 ca-certificates && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Set Prisma engine for Debian Linux
ENV PRISMA_CLI_BINARY_TARGETS="debian-openssl-3.0.x"

# Install all dependencies (including devDependencies for build)
RUN npm ci && npm cache clean --force

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Generate Prisma client again to ensure it's available in production
RUN npx prisma generate

# Production stage
FROM node:18-slim AS production

# Install OpenSSL and other required dependencies for Prisma runtime
RUN apt-get update && apt-get install -y openssl libssl3 ca-certificates && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app

# Create a non-root user
RUN groupadd --gid 1001 nodejs
RUN useradd --uid 1001 --gid nodejs --shell /bin/bash --create-home nextjs

# Copy package files and install only production dependencies
COPY --chown=nextjs:nodejs package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy built application and prisma
COPY --from=builder --chown=nextjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma

# Ensure Prisma client is generated for production
RUN npx prisma generate

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 3001) + '/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

# Start the application
CMD ["npm", "start"]