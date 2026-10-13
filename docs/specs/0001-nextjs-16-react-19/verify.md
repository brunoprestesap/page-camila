# Verify: Next.js 16 e React 19 · spec 0001 · updated 2026-10-13
_Passos derivados dos critérios de aceitação da spec 0001. O `/check verify` roda estes passos; o `/test` trava os duráveis._

## Preparação
- A linha de base do Next 14 fica na pasta temporária da sessão do `/develop` (`scratchpad/baseline/`): prints, `notes.md`, lista de `out/` e a cópia `out-next14/`. Se ela não existir mais, gere de novo a partir do commit `fd934c2`.
- Sirva o build com `npx serve out -l 4173`. A porta 3000 pode estar ocupada por um `next dev` seu. Use a mesma porta antes e depois.
- O navegador do Playwright MCP bloqueia `googletagmanager.com` e `connect.facebook.net`. Para medir status, intercepte com `page.route(/googletagmanager\.com|connect\.facebook\.net/, r => r.fetch().then(x => r.fulfill({ response: x })))`.
- Estado fixado: `localStorage` limpo, sem clicar nos carrosséis; antes do print, rolar a página até o fim, voltar ao topo e esperar 3 s (a rede nunca para por causa do vídeo e do mapa, então não use `networkidle`).

## Commands
- [x] `rm -rf node_modules && npm install` → sem aviso `ERESOLVE`; `npm ls react` mostra só `19.3.x` → AC-1
- [x] `npm audit --omit=dev --audit-level=high` → `found 0 vulnerabilities` (os alertas restantes são só de desenvolvimento: cadeia do ESLint 8 e do Tailwind 3) → AC-1
- [x] `rm -rf .next out && npm run build` → primeira linha `Next.js 16.x (Turbopack)`, termina sem erro → AC-2
- [x] `find out -type f | sort` → contém `index.html`, `politica-de-privacidade.html`, `404.html` e os mesmos 27 arquivos de `assets/` da linha de base (`_not-found.html` é novo e esperado) → AC-2
- [x] `npm run lint` → passa sem erros nem avisos → AC-8
- [x] Colocar `<img src="/x.png" alt="teste" />` dentro da `div#brand` em `components/Brand.tsx`, rodar `npm run lint` → falha com `@next/next/no-img-element` e `too many warnings`; desfazer com `git checkout components/Brand.tsx` → AC-8

## UI / manual
- [x] Prints de página inteira da home e da política, em 1440x900 e 390x844, comparados com a linha de base → mesmas alturas; diferenças só no carrossel de depoimentos (animação) e na barra de progresso do vídeo; o mapa é ignorado → AC-3
- [x] Home com interceptação: `gtm.js?id=GTM-KMRWN8G3` volta 200 e o `dataLayer` tem uma entrada com `gtm.start` (eventos `gtm.js`, `gtm.dom`, `gtm.load`) → AC-4
- [x] Clicar no botão flutuante `button[title="Whatsapp"]` → `dataLayer` contém `{ event: "buttonClicked", value: "whatsapp" }`; o link tem `href="https://wa.me/5596991354590"` e `target="_blank"`; feche a aba nova → AC-5
- [x] `localStorage` limpo → barra "Nosso site usa cookies" visível e botão do WhatsApp em `bottom-20`; clicar em Aceitar → barra some, botão em `bottom-4`, `cookieAccepted = "true"`; recarregar → barra continua sumida → AC-6
- [x] Console das duas páginas no `out/` servido → só erros de rede de terceiros (bloqueio) e logs do Google Maps, iguais à linha de base → AC-7
- [x] `npx next dev -p 3100`, abrir as duas páginas → nenhum erro de hidratação; avisos conhecidos: `hero.jpg` com `fill` (já existia) e `quality 100` fora de `images.qualities` (novo no Next 16, sem efeito com `unoptimized`) → AC-7
- [x] Meta Pixel com interceptação → `fbevents.js` carrega e sai exatamente 1 requisição `facebook.com/tr` com `ev=PageView`, igual à linha de base → AC-7

## Value sourcing
- [x] Versões no `package.json` batem com o AC-1 (`next` e `@next/third-parties` em `^16.4.0`, `react`, `react-dom` e tipos em `^19.3.0`) → AC-1
- [x] Script `build` sem flag `--webpack` → AC-2
- [x] `tsconfig.json` com `jsx: "react-jsx"` e `.next/dev/types/**/*.ts` no `include` (ajuste automático do Next 16) → AC-2
- [x] `.eslintrc.json` inalterado, `eslint@^8.57.1` e `eslint-config-next@^14.2.35` → AC-8
- [x] `next.config.mjs` inalterado (`output: "export"`, `images.unoptimized: true`) → AC-2

## Acceptance-criteria coverage
- AC-1: Commands 1, 2; Value sourcing 1
- AC-2: Commands 3, 4; Value sourcing 2, 3, 5
- AC-3: UI 1
- AC-4: UI 2
- AC-5: UI 3
- AC-6: UI 4
- AC-7: UI 5, 6, 7
- AC-8: Commands 5, 6; Value sourcing 4

## Resultado da build (2026-10-13)
Todos os passos acima passaram durante o `/develop`.

## /check verify (2026-10-13): PASS
Todos os passos rodados de novo do zero (install limpo, build, lint, prints, rastreamento, cookies, console). Observações:
- Com o Pixel carregando de verdade, o console da home mostra `[Meta Pixel] - Duplicate Pixel ID`. O mesmo aviso aparece no build do Next 14 (comparado lado a lado), então não é regressão; é o problema da feature 3.
- Um 404 apareceu uma vez no `next dev` e não se repetiu na segunda carga nem no build estático.
