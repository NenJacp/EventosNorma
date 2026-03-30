# Etapa de construcción (Debian Slim para máxima compatibilidad)
FROM node:22-slim AS build

WORKDIR /app

# Instalar pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copiar archivos de dependencias
COPY package.json pnpm-lock.yaml ./

# Instalar dependencias
RUN pnpm install --frozen-lockfile

# Copiar el resto del código
COPY . .

# Argumento para la URL de la API
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Construir la aplicación
RUN pnpm run build

# Etapa de producción (Alpine es perfecto para servir archivos estáticos)
FROM nginx:stable

# Copiar la build del frontend
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
