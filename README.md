# Aguiar Movies

Frontend de catálogo de filmes e séries com autenticação, favoritos, watchlist, reviews e fórum — inspirado no design do Netflix/Prime Video.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** com tema dark/light (oklch)
- **shadcn/ui** + **lucide-react**
- **Axios** com interceptor JWT (refresh automático)
- **SweetAlert2** para todos os diálogos
- **TMDB API** (via proxy no backend Django)
- **Docker** exposto na porta `2109`

## Funcionalidades

- Autenticação com JWT (access 2h / refresh 7d)
- Listagem de filmes e séries com scroll infinito e filtro por gênero
- Busca ao vivo (sem Enter) com debounce de 300ms
- Favoritos e Watchlist sincronizados com o backend
- Reviews por conteúdo com avaliação por estrelas
- Fórum de discussões por filme/série
- Dark mode / Light mode com persistência em localStorage

## Pré-requisitos

- Node.js 20+
- Backend Django rodando em `localhost:8000` (ou configurável via `.env.local`)

## Instalação

```bash
git clone https://github.com/dfilho13/aguiar-mv-react-web.git
cd aguiar-mv-react-web
npm install
cp .env.example .env.local
# edite .env.local com suas credenciais
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha os valores:

```bash
cp .env.example .env.local
```

Veja `.env.example` para a lista completa e descrição de cada variável.

## Docker

```bash
docker compose up --build
```

A aplicação estará disponível em [http://localhost:2109](http://localhost:2109).

> As variáveis de ambiente também precisam estar definidas no `docker-compose.yml` ou passadas via `--env-file`.

## Scripts

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia servidor de desenvolvimento com Turbopack |
| `npm run build` | Gera build de produção |
| `npm run start` | Inicia servidor de produção |
| `npm run lint` | Executa ESLint |

## Estrutura de pastas

```
app/              → Rotas e páginas (App Router)
components/ui/    → Componentes shadcn/ui
domain/           → Enums, tipos e interfaces de domínio
infra/            → Clientes HTTP (axios), repositórios
modules/          → Módulos por feature (auth, tmdb, favorites, watchlist, reviews, forum)
services/         → Camada de serviço (consome repositórios)
shared/           → Hooks, componentes e utilitários compartilhados
```
