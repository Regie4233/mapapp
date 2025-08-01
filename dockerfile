# Dockerfile

# ---- Base Stage ----
# Use a specific Node.js version for reproducibility.
# Alpine Linux is a lightweight distribution, resulting in smaller images.
FROM node:20-alpine AS base
WORKDIR /app

# ---- Dependencies Stage ----
# Install dependencies first in a separate step to take advantage of Docker's caching.
# This layer is rebuilt only when package.json or package-lock.json changes.



FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci

# ---- Builder Stage ----
# Build the Next.js application using the installed dependencies.
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .



# Declare a build-time argument. This needs to be passed in during the build.
ARG NEXT_PUBLIC_PB_IMAGE_URL
# Set the build-time argument as an environment variable for the build process.
ENV NEXT_PUBLIC_PB_IMAGE_URL=$NEXT_PUBLIC_PB_IMAGE_URL

ARG NEXT_PUBLIC_POCKETBASE_URL
ENV NEXT_PUBLIC_POCKETBASE_URL=$NEXT_PUBLIC_POCKETBASE_URL


# The Next.js build process will automatically use variables starting with NEXT_PUBLIC_.
# You can set build-time variables here if needed, but it's better to
# pass them during the build command for flexibility.
# Example: E    
RUN npm run build

# ---- Runner Stage ----
# Create the final, minimal production image.
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy the standalone output from the builder stage.
# This includes the server.js file, the .next/server directory, and a minimal node_modules.
# Your `next.config.ts` is already configured with `output: "standalone"`.
COPY --from=builder /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

# Expose the port the app will run on.
EXPOSE 3000

# Set the user to a non-root user for better security.
USER node

# The command to run the application.
# The standalone output creates a `server.js` file for this purpose.
CMD ["node", "server.js"]
