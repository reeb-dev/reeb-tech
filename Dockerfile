# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Build de la aplicación
RUN npm run build

# Stage 2: Serve
FROM node:20-alpine

WORKDIR /app

# Instalar servidor HTTP ligero
RUN npm install -g http-server

# Copiar build desde el stage anterior
COPY --from=builder /app/dist/manuelreeb/browser /app/dist

# Exponer puerto
EXPOSE 3000

# Comando para iniciar el servidor
CMD ["http-server", "dist", "-p", "3000", "-c-1"]
