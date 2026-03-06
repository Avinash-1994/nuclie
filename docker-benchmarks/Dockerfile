FROM node:20-alpine

# Install git and build tools
RUN apk add --no-cache git python3 make g++ rust cargo

# Install global tools
RUN npm i -g vite webpack rspack rollup esbuild @angular/cli typescript tsx

# Setup Urja (Local)
# In a real CI, we'd install from registry. Here we copy local source.
WORKDIR /urja-source
COPY . /urja-source
RUN npm install
RUN npm run build
RUN npm link

# Setup Benchmarks
WORKDIR /app
COPY docker-benchmarks/package*.json ./
RUN npm install
COPY docker-benchmarks/ .

# Link Urja
RUN npm link urja

ENV URJA_CLI=/urja-source/dist/cli.js

CMD ["npm", "run", "bench"]
