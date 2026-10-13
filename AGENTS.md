# page_dra_camila

Landing page da Dra. Camila Neiva (médica psiquiatra em Macapá/AP). Uma página principal com seções em sequência, mais a página `/politica-de-privacidade`. Todo o conteúdo e a interface são em português do Brasil.

## Stack

- **Language / Runtime**: TypeScript (strict), Node 24
- **Framework**: Next.js 16 (App Router, build com Turbopack), React 19
- **Key dependencies**: Tailwind CSS 4 (plugin `@tailwindcss/postcss`), `react-icons`, `@next/third-parties` (Google Tag Manager)
- **Package manager**: npm (`package-lock.json`)

## Build approach

Tracer Bullet (cada passo deixa o site inteiro funcionando, com build e páginas no ar, antes do próximo).

## Commands

```bash
# Install
npm install

# Dev server
npm run dev

# Build (o prebuild roda o lint antes; depois gera o site estático em out/)
npm run build

# Lint
npm run lint

# Test
# sem suíte de testes por enquanto
```

## Specs

Stored in `docs/specs/`. Format: `docs/specs/NNNN-title.md`.

## Rules

- O site é exportado como estático (`output: "export"` em `next.config.mjs`). Nada de API routes, Server Actions, middleware ou qualquer coisa que precise de servidor. Imagens usam `unoptimized: true`.
- Uma seção da página = um componente em `components/` (PascalCase, `export default`), montado em ordem no `app/page.tsx`. Cards e itens repetidos ficam em componentes `Card*`, alimentados por um array local no componente da seção.
- Props tipadas com `interface Props` no próprio arquivo. Import com o alias `@/` a partir da raiz.
- Estilo só com classes Tailwind. As cores da marca são hex fixos nas classes: `#003E53` (azul escuro, botões), `#CDBCA8` (bege), `#7C5A12` (dourado, destaques), `#03C988` (WhatsApp). Reaproveite essas antes de criar outras.
- A configuração do Tailwind fica no `app/globals.css` (não existe `tailwind.config`). Ele só lê classes de `app/` e `components/` (`source(none)` com dois `@source`). Uma pasta nova com componentes precisa de um `@source` lá, senão as classes dela não geram CSS (spec 0003).
- `"use client"` só onde há estado, efeito ou API do navegador (ex.: `CookieNotice`, `MetaPixel`, `Depositions`, `ContentsVideo`).
- Lint: ESLint 10 com `eslint.config.mjs` (flat config, `eslint-config-next/core-web-vitals`), rodando no projeto todo com `--max-warnings 0`. Corrija o código em vez de usar `eslint-disable` ou desligar regras (spec 0002).
- Arquivos estáticos (imagens, capas, vídeos `.mp4`) ficam em `public/assets/` e são referenciados como `/assets/...`.
- Âncoras de navegação usam `id` nas seções (`sobre`, `tratamentos`, `cta`). Ao renomear um `id`, procure os links que apontam para ele.

## Gotchas

- O link do WhatsApp (`https://wa.me/5596991354590`) está repetido em `Hero`, `FormCta` e `BtnWhats`. Mudou o número, mude nos três.
- Rastreamento: o ID do GTM fica em `app/page.tsx` e o ID do Meta Pixel em `components/MetaPixel.tsx`. O clique no botão flutuante do WhatsApp dispara `sendGTMEvent`.
- O aviso de cookies (`CookieNotice`) é renderizado por dentro de `BtnUp`, e ele mesmo decide a posição do `BtnWhats` (aceite salvo em `localStorage`).
- Metadados (title, description) ficam em cada `page.tsx`, além do padrão em `app/layout.tsx`.
- Deploy: o projeto `landing-camila` na Vercel builda a partir do git com `npm run build` e precisa de Node 24.x (o 20.x foi descontinuado e fazia todo deploy falhar). Como o lint roda no `prebuild`, um erro de lint barra o deploy.
- Depois de mudar dependências, confira o lock com `npm ci` numa pasta limpa. Um `npm i` sobre um `node_modules` já existente deixou dependências opcionais de fora do `package-lock.json` (a Vercel usa `npm install` e não acusa).
- O lock precisa ter `@tailwindcss/oxide-linux-x64-gnu` e `lightningcss-linux-x64-gnu`, os binários do Tailwind 4 que a Vercel usa. O `npm ci` num Mac não acusa se eles faltarem.
- Diferenças do Tailwind 4 que já pegaram este site: campos de formulário vêm com fundo transparente (declare `bg-white`), `leading-*` sempre ganha da altura de linha de `text-*`, `hover:` só vale em aparelhos com mouse, e os botões usam a seta padrão (o `globals.css` devolve a mãozinha). Ao mexer em estilo, compare prints antes e depois.

## Agent skills

<!-- Nenhuma skill de ferramenta instalada. Busca adiada pelo usuário (Next.js, Tailwind, GTM, Meta Pixel são candidatos). -->

## Context files

<!-- Nested AGENTS.md files are listed here as they are created -->

_Drafted by /audit from the repo, worth a quick human pass. Edit freely: once a line stops matching this draft, later runs treat it as curated and will flag rather than overwrite it._

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
