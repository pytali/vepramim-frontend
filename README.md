This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Configuração de Variáveis de Ambiente

O projeto utiliza as seguintes variáveis de ambiente:

```env
# Autenticação da API
API_USER=usuario_api
API_PASSWORD=senha_api
API_URL=url_da_api

# Thresholds de sinal para ativação de ONUs (em dBm)
NEXT_PUBLIC_OPTIMAL_SIGNAL_THRESHOLD=-15   # Limite para sinal ótimo
NEXT_PUBLIC_ACCEPTABLE_SIGNAL_THRESHOLD=-19 # Limite para sinal aceitável
NEXT_PUBLIC_CRITICAL_SIGNAL_THRESHOLD=-26  # Limite para exclusão automática de ONU
```

### Thresholds de Sinal

Os thresholds de sinal são utilizados na ativação de ONUs para determinar a qualidade do sinal:

- **OPTIMAL_SIGNAL_THRESHOLD**: Valores acima deste threshold são considerados ótimos
- **ACCEPTABLE_SIGNAL_THRESHOLD**: Valores entre este e o optimal são considerados aceitáveis
- **CRITICAL_SIGNAL_THRESHOLD**: Valores abaixo deste threshold causam exclusão automática da ONU

Para configurar estes valores, crie um arquivo `.env.local` com os valores desejados.
