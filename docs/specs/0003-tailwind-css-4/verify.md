# Verify: Tailwind CSS 4 · spec 0003 · updated 2026-10-13
_Passos derivados dos critérios de aceite da spec 0003. O `/check verify` roda estes passos, e o `/test` trava os que valem a longo prazo._

A linha de base (Tailwind 3, commit `6ca058a` no `main`) foi guardada na pasta temporária da sessão do `/develop`, que se perde com o `/clear`. Para refazer, rode `git worktree add ../camila-v3 6ca058a`, depois `npm ci && npm run build` lá, e sirva o `out/` dele numa porta separada. Os valores de referência já medidos estão anotados em cada passo.

Neste Mac a porta 3000 está ocupada por outro processo. Sirva com `npx serve out -l <porta livre>`.

## UI / manual
- [ ] Servir o `out/` novo, limpar o `localStorage` e tirar prints de página inteira das duas páginas (`/` e `/politica-de-privacidade`) em 1440 px e 390 px, seguindo o *Protocolo de verificação* da spec 0001 → iguais à linha de base. No build do `/develop`: 0 pixels diferentes, fora a barra de progresso nativa do player de vídeo no celular (22 pixels) → AC-4
- [ ] Conferir de perto as caixas brancas translúcidas (`Hero` com `bg-white/50`, `Brand` e política com `bg-white/60`), o desfoque do `Apresentation` no desktop, os campos brancos do formulário de contato e a altura do bloco de depoimentos no desktop → iguais à linha de base → AC-4
- [ ] Em 1440 px, sem aceite salvo: `getComputedStyle(b).cursor` de cada `<button>` da página principal → `pointer` nos 6 botões (Whatsapp, Aceitar, Agende sua consulta ×2, Traçar rotas, Enviar mensagem) → AC-5
- [ ] Focar o primeiro campo do formulário de contato e ler o `box-shadow` calculado → contém `rgb(0, 62, 83) 0px 0px 0px 3px` → AC-5
- [ ] Em 1440 px com mouse, passar o mouse sobre o primeiro card de `CardExperience` → o card sobe 8px → AC-5
- [ ] Num contexto do Playwright com `isMobile: true` e `hasTouch: true` (390 px), conferir `matchMedia('(hover: none)')` como `true` e tocar no primeiro card visível de `CardBeneficios` → o card não se move (0px; no v3 subia 8px e ficava preso) → AC-6
- [ ] Barra de cookies: sem aceite, a barra aparece e o botão do WhatsApp fica acima dela (base do botão a 820px); ao clicar em Aceitar, a barra some e o botão desce (884px); ao recarregar, a barra não volta → AC-7
- [ ] Console das duas páginas no `out/` servido e no `npm run dev` → só as mensagens da linha de base (aviso de Pixel duplicado da feature 3, avisos de imagem do `hero.jpg` no dev, um 404 de recurso), nenhum erro novo → AC-7
- [ ] Preview da branch `feature/tailwind-4` na Vercel (projeto `landing-camila`): abrir pelo `vercel curl` com o link local para `landing-camila` e comparar o CSS servido com o do build local → idêntico byte a byte. Um print do preview exige liberar a proteção de acesso (o Vercel MCP não tem acesso a esse projeto) → AC-8

## Commands
- [ ] `npm ls tailwindcss @tailwindcss/postcss` → as duas em 4.3.3. `tailwind.config.ts` não existe. `postcss.config.mjs` só com `"@tailwindcss/postcss": {}` → AC-1
- [ ] `npm ci` numa cópia limpa (só `package.json` e `package-lock.json`) → termina sem erro → AC-1
- [ ] `grep -n '"node_modules/@tailwindcss/oxide-linux-x64-gnu"\|"node_modules/lightningcss-linux-x64-gnu"' package-lock.json` → as duas entradas presentes → AC-1
- [ ] `npm audit --json` comparado com a linha de base, por pares (pacote, alerta e gravidade) → nenhum par novo. No build: 10 alertas → 5, todos da cadeia do lint (spec 0002). Um par novo só é aceito se o `via` não passar por `tailwindcss`, `@tailwindcss/*`, `lightningcss` nem `postcss` → AC-1
- [ ] Ler o `app/globals.css` → `@import "tailwindcss" source(none);`, `@source "../app";`, `@source "../components";` e só o `@layer base` do cursor. Nada de `@tailwind`, `@config`, `@theme`, `.cookie-notice` nem bloco de compatibilidade de borda ou `ring` → AC-2
- [ ] `npm run build` → o `prebuild` roda o lint, e o build termina com sucesso → AC-3
- [ ] Lista de arquivos de `out/` sem `_next/static/` → igual à da linha de base (43 arquivos). Arquivos de `public/` iguais byte a byte aos do `out/` → AC-3
- [ ] Diff dos HTML com os hashes de `_next/static/`, os `class="…"` e os `className` do payload normalizados → só sobra o ID do build (`"b":"…"`). As mudanças de classe são exatamente: `md:leading-7` (+), `-translate-x-0` → `translate-x-0`, `bg-opacity-60` (−), `bg-white bg-opacity-60` → `bg-white/60`, `border-[#003E53]-300 focus:ring` → `bg-white focus:ring-3`, `hover:bg-light-gray` (−), `md:backdrop-blur-sm` → `md:backdrop-blur-xs` → AC-3
- [ ] No CSS de `out/_next/static/chunks/*.css`: toda regra `\:hover` dentro de `@media (hover:hover)` (o texto do próprio media não conta), nenhuma ocorrência de `.font-sans` (classe que só existe em `.claude/`), e a regra `button:not(:disabled)` presente → AC-6
- [ ] `grep -rnE 'bg-opacity-|border-\[#003E53\]-300|hover:bg-light-gray' app components` → nada. `backdrop-opacity-10` presente em `Hero`, `Brand` e na política → AC-6

## Value sourcing
- [ ] Fontes de classes: trocar temporariamente uma classe de `components/` por uma que só existe em `docs/` e conferir que ela some do CSS, e que `font-sans` continua ausente mesmo estando em `.claude/` → as fontes são só `app/` e `components/`
- [ ] Cursor: ler o `cursor` de um `<button disabled>` criado no console → `default` (a regra só vale para botões habilitados)
- [ ] Anel de foco: focar os quatro campos (nome, telefone, e-mail, mensagem) → todos com o anel de 3px em `rgb(0, 62, 83)`
- [ ] Caixas translúcidas: ler o `background-color` calculado → `Hero` com alfa 0.5, `Brand` e política com alfa 0.6

## Acceptance criteria coverage
- AC-1: passos de `npm ls`, `npm ci`, entradas do lock e audit
- AC-2: leitura do `globals.css`
- AC-3: build, lista de `out/`, `public/` e diff dos HTML
- AC-4: prints e conferência de perto
- AC-5: cursor, anel de foco e hover no desktop
- AC-6: toque no celular simulado, CSS gerado e busca das classes mortas
- AC-7: barra de cookies e console
- AC-8: preview na Vercel
