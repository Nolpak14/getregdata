# Root Dockerfile so Glama (and other registries) build the MCP server that
# lives in mcp/. tools/list + regdata_catalog introspect with NO credentials;
# APIFY_TOKEN is only needed at actual tool-call time. Mirrors mcp/Dockerfile
# but with the build context at the repo root, where Glama's builder looks.
FROM node:20-alpine
WORKDIR /app
COPY mcp/package.json mcp/package-lock.json ./
RUN npm ci --omit=dev
COPY mcp/index.js mcp/actors.js mcp/README.md ./
ENTRYPOINT ["node", "index.js"]
