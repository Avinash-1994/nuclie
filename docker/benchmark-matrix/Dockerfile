
# Nuclie Benchmark Matrix Dockerfile
# Production-ready environment for multi-tool performance auditing

FROM node:20-slim

# Install system dependencies for build tools and memory monitoring
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    curl \
    git \
    procps \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /benchmark

# Pre-install global industry-standard build tools
# This ensures we don't include installation time in cold start measurements
RUN npm install -g \
    vite \
    webpack webpack-cli \
    @rspack/core @rspack/cli \
    esbuild \
    @angular/cli \
    turbo

# Copy Nuclie build artifacts (Assumes they are already built in dist/)
COPY dist /benchmark/nuclie/dist
COPY package.json /benchmark/nuclie/package.json
COPY node_modules /benchmark/nuclie/node_modules

# Environment variables for performance tuning
ENV NODE_ENV=production
ENV CI=true

# Set up benchmark volumes
VOLUME [ "/results" ]

# Default command: Run the matrix automation script
# We will mount the current workspace scripts into the container at runtime
CMD ["node", "scripts/run-benchmark-matrix.ts"]
