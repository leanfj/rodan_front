# Etapa 1: Build com PNPM
FROM node:18-alpine AS build

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

# Etapa 2: Servir com NGINX
FROM nginx:alpine AS deploy

# Remove os arquivos padrão do NGINX
RUN rm -rf /usr/share/nginx/html/*

# Copia os arquivos estáticos gerados no build para o NGINX
COPY --from=build /app/dist /usr/share/nginx/html

# Copia configuração customizada do NGINX para tratar SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
