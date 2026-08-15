# Stage 1: Build the application
FROM oven/bun:1 AS builder
WORKDIR /app

# Install dependencies
# Using frozen-lockfile ensures deterministic builds based on the lockfile
COPY package.json bun.lock bunfig.toml ./
RUN bun install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the application
# We set NITRO_PRESET=node-server so that Nitro builds a Node.js compatible server 
# instead of the default Cloudflare worker for Lovable apps
ENV NITRO_PRESET=node-server
RUN bun run build

# Stage 2: Serve the application
FROM node:20-alpine AS runner
WORKDIR /app

# Copy built assets from the builder stage
# Nitro's node-server preset outputs to the .output directory by default
COPY --from=builder /app/.output ./.output

# Set environment variables for the runtime
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

# Start the Nitro node server
CMD ["node", ".output/server/index.mjs"]
