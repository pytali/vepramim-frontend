# Guia do Projeto: Vepramim Frontend

## Visão Geral

Este projeto é um sistema web para **gerenciamento de OLTs e ONUs** (equipamentos de redes ópticas), focado em operações como ativação, pesquisa, monitoramento e controle de acesso, utilizado por equipes técnicas, suporte e gestão. O frontend é construído com **Next.js** (App Router), React 19, TypeScript e TailwindCSS, integrando-se a APIs externas para autenticação, consulta e operações sobre ONUs/OLTs.

---

## Principais Funcionalidades
- **Login e Autenticação JWT** (com cookies httpOnly e refresh token)
- **Dashboard** com visão geral, status do sistema e logs de atividades
- **Pesquisa e Ativação de ONUs** (com validação de sinal óptico)
- **Gestão de OLTs**
- **Controle de Acesso Baseado em Papéis (RBAC)**
- **Logs de Atividade**
- **Chat de Suporte Integrado**

---

## Tecnologias Utilizadas
- **Next.js 15** (App Router, API Routes, SSR/CSR)
- **React 19**
- **TypeScript** (tipagem estática)
- **Zod** (validação runtime de dados)
- **TailwindCSS 4** (com customizações e animações)
- **Radix UI** (componentes acessíveis)
- **Zustand** (gerenciamento de estado global)
- **React Hook Form** (formulários)
- **JWT Decode** (decodificação de tokens)
- **Lottie** (animações)
- **Lucide** (ícones)

---

## Estrutura de Pastas
```
├── src/
│   ├── app/           # Rotas, páginas e APIs (Next.js App Router)
│   ├── components/    # Componentes reutilizáveis (UI, formulários, etc.)
│   ├── lib/           # Lógicas de autenticação, utilitários globais
│   ├── store/         # Zustand stores (estado global)
│   ├── types/         # Tipos TypeScript e enums de domínio
│   ├── utils/         # Funções auxiliares e helpers
│   └── services/      # (Reservado para integrações externas)
├── public/            # Assets estáticos
├── docs/              # Documentação e Swagger
├── @docs/             # (Nova) Documentação interna do projeto
```

---

## Fluxo de Autenticação
- **Login:** `/api/auth` faz POST para API externa, armazena JWT e refresh token em cookies httpOnly.
- **Proteção de Rotas:** Middleware verifica token e roles.
- **Refresh Token:** Automatizado via função `refreshAuthToken`.
- **Logout:** Remove cookies de autenticação.

---

## Controle de Acesso (RBAC)
- Papéis: `ADMIN`, `USER`, `TECHNICIAN`, `MANAGER`, `SUPERVISOR`, `SUPPORT`.
- Permissões configuradas em `src/types/auth.ts`.
- Componentes e rotas usam `<RoleCheck requiredRoles={...}>` para proteger ações.

---

## Gerenciamento de Estado
- **Zustand** para OLTs, logs de atividade e outros estados globais.
- **React Context** para temas (dark/light).

---

## Validação de Dados
- **TypeScript**: Tipos para todas as entidades (ex: ONU, Usuário, Auth)
- **Zod**: Validação runtime de dados de formulários e respostas de API.
- **Mensagens de erro amigáveis** em caso de falha de validação.

---

## Variáveis de Ambiente
Crie um arquivo `.env.local` com:
```env
API_USER=usuario_api
API_PASSWORD=senha_api
API_URL=url_da_api
NEXT_PUBLIC_OPTIMAL_SIGNAL_THRESHOLD=-15
NEXT_PUBLIC_ACCEPTABLE_SIGNAL_THRESHOLD=-19
NEXT_PUBLIC_CRITICAL_SIGNAL_THRESHOLD=-26
```
- **Thresholds de sinal**: Usados para classificar a qualidade do sinal óptico na ativação de ONUs.

---

## Comandos Úteis
- `npm run dev` — inicia o servidor de desenvolvimento
- `npm run build` — build de produção
- `npm run start` — inicia o servidor em produção
- `npm run lint` — checagem de lint

---

## Boas Práticas e Padrões
- **1 commit por tarefa** (veja padrão no onboarding)
- **1 funcionalidade por vez**
- **Validação obrigatória com TypeScript + Zod**
- **Documentação e changelog sempre atualizados**
- **Evite duplicação de código e arquivos grandes (>200-300 linhas)**
- **Nunca simule dados em dev/prod**
- **Não sobrescreva .env sem aprovação**

---

## Onboarding Rápido
1. Clone o repositório e instale as dependências (`npm install`)
2. Configure o `.env.local` conforme exemplo acima
3. Rode `npm run dev` e acesse [http://localhost:3000](http://localhost:3000)
4. Consulte este guia e o código para entender os fluxos principais

---

## Referências e Links Úteis
- [Next.js Docs](https://nextjs.org/docs)
- [Zod Docs](https://zod.dev)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [Radix UI](https://www.radix-ui.com/)
- [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)

---

## Contato e Suporte
Dúvidas, sugestões ou problemas? Utilize o chat integrado ou abra uma issue no repositório. 