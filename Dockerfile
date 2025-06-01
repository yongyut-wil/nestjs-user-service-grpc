# Stage 1: Build the application
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and yarn.lock (or package-lock.json)
COPY package.json yarn.lock ./

# Install all dependencies (including devDependencies for the build process)
RUN yarn install --frozen-lockfile

# Copy the rest of the application source code
COPY . .

# Build the application
# The build script (nest build && cpx "proto/**/*" dist/proto) handles proto files
RUN yarn build

# Make sure proto files are properly copied to dist/proto
RUN ls -la dist/proto || (mkdir -p dist/proto && cp -r proto/* dist/proto/)

# Remove devDependencies to reduce the size of node_modules
# and clean yarn cache. This node_modules will be copied to the final image.
RUN yarn install --production --frozen-lockfile && yarn cache clean

# Stage 2: Create the lightweight production image
FROM node:18-alpine

# Set environment to production
ENV NODE_ENV=production

WORKDIR /usr/src/app

# Copy package.json and yarn.lock (yarn.lock might not be strictly necessary if node_modules are pre-built and copied directly)
COPY --from=builder /usr/src/app/package.json /usr/src/app/yarn.lock ./

# Copy the pruned node_modules from the builder stage
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Copy the built application (dist folder)
COPY --from=builder /usr/src/app/dist ./dist

# Double check proto files are in dist/proto directory
RUN ls -la dist/proto

# Expose the gRPC port
EXPOSE 50051

# Health check for the gRPC service
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD nc -z localhost 50051 || exit 1

# Command to run the application (uses 'node dist/main' via package.json script 'start:prod')
CMD ["yarn", "start:prod"]
