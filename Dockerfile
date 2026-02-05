# Stage 1: Build the React Frontend
FROM node:18 AS build-stage
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Set up the Backend and Serve Frontend
FROM node:18
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ ./

# Copy the build results from Stage 1 to the backend's 'public' folder
COPY --from=build-stage /app/frontend/build ./public

EXPOSE 5000
CMD ["node", "server.js"]