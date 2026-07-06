# getregdata MCP server (stdio). Built by Glama and other registries to run
# introspection checks. tools/list + regdata_catalog need no credentials; an
# APIFY_TOKEN is only required at actual tool-call time.
FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY index.js actors.js README.md ./
ENTRYPOINT ["node", "index.js"]
