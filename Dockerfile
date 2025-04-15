# Estágio de build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Definir NODE_ENV como production
ENV NODE_ENV=production

# Build da aplicação
RUN npm run build

# Estágio de produção
FROM node:20-alpine AS runner

WORKDIR /app

# Criar usuário não-root
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Copiar apenas os arquivos necessários do estágio de build
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Definir NODE_ENV como production
ENV NODE_ENV=production
ENV PORT=3000

# Mudar propriedade dos arquivos para o usuário nextjs
RUN chown -R nextjs:nodejs /app

# Mudar para usuário não-root
USER nextjs

# Expor porta
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["node", "server.js"] 