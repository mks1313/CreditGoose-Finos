FROM node:18-bullseye

# Instalar herramientas necesarias
RUN apt-get update && apt-get install -y dumb-init curl bash bzip2 libxcb1

# Descargar y extraer Goose CLI (versión x86_64)
ENV GOOSE_VERSION=v1.0.24
RUN curl -L -o goose.tar.bz2 \
    "https://github.com/block/goose/releases/download/${GOOSE_VERSION}/goose-x86_64-unknown-linux-gnu.tar.bz2" \
  && tar -xjf goose.tar.bz2 \
  && mv goose /usr/local/bin/goose \
  && chmod +x /usr/local/bin/goose \
  && rm goose.tar.bz2

# Crear directorio de configuración para Goose
RUN mkdir -p /root/.config/goose
COPY ./goose/config.yaml /root/.config/goose/config.yaml

# Variables de entorno para Goose
ENV GOOSE_PROVIDER=google
ENV GOOSE_MODEL=gemini-2.0-flash

# Optimización
ENV NODE_ENV=production

# Crear directorio de la app
WORKDIR /usr/src/app

# Copiar archivos de la app (como root)
COPY . /usr/src/app

# Instalar solo dependencias de producción
RUN npm ci --only=production

# Crear usuario no-root
RUN useradd -ms /bin/bash goose

# Cambiar al usuario no-root
USER goose

# Exponer puerto y comando de arranque
EXPOSE 8080
CMD ["dumb-init", "node", "server.js"]