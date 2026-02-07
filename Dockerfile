# Stage 1: Build the React Frontend
FROM node:18-alpine AS build-frontend
WORKDIR /app/frontend

# Copy package files
COPY frontend/package*.json ./

# If you have a lockfile, npm install will respect it; if not, it will create one.
# Added --loglevel error so you can actually see what's wrong if it fails!
RUN npm install --loglevel error

COPY frontend/ ./
RUN npm run build

# Stage 2: Final Production Image
FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production

# Copy backend package files
COPY backend/package*.json ./

# Install ONLY production dependencies for the backend
RUN npm install --only=production --loglevel error

# Copy backend source code
COPY backend/ ./

# Copy the static build from Stage 1
COPY --from=build-frontend /app/frontend/build ./public

EXPOSE 5000

# Security best practice: don't run as root
USER node

CMD ["node", "server.js"]