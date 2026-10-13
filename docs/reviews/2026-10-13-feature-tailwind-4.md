# Review, feature/tailwind-4, 2026-10-13

**Reviewed by**: Claude Sonnet 5.5 (autor no opus)
**Scope**: 18 arquivos, branch vs main
**Verdict**: Approve with nits

## Summary
A mudança migra o Tailwind 3.4 para o 4.3: troca o plugin do PostCSS, move a configuração para `app/globals.css` com `source(none)` e dois `@source`, remove `tailwind.config.ts` e a classe morta `.cookie-notice`, e ajusta apenas classes `className` nos componentes. O diff dos componentes bate item a item com a tabela de "API surface" da spec 0003, sem mudanças de JavaScript, e não achei classes do v3 renomeadas que tenham ficado para trás. Só há observações menores.

## Minor
### 🟡 Classes sem efeito herdadas, `components/Depositions.tsx:91`
**Problema**: `translate-x-0` (e o mesmo em `components/ContentsVideo.tsx:76,80` e `Depositions.tsx:95`) não altera nada; era `-translate-x-0` no v3. A migração só trocou o prefixo. O mesmo vale para `duration-500` sem `transition-*` em `ContentsVideo.tsx:67` e `Depositions.tsx:82`, e para `transform` em vários cards.
**Por que importa**: ruído que confunde a leitura (o mesmo tipo de limpeza que a spec fez com `bg-opacity-*` e `hover:bg-light-gray`). Não afeta o comportamento.
**Correção sugerida**: opcional, numa feature de limpeza à parte: remover `translate-x-0`. Manter como está é coerente com a regra da spec de só aplicar renomes obrigatórios.

### 🟡 Sem fallback para navegadores antigos, `app/globals.css:1`
**Problema**: o Tailwind 4 exige Safari 16.4+, Chrome 111+ e Firefox 128+; fora disso o site perde os estilos (usa `@property` e `color-mix`).
**Por que importa**: o público de uma clínica em Macapá pode incluir aparelhos antigos. A spec já aceita isso explicitamente (Consequences), então é só um risco registrado, não um defeito.
**Correção sugerida**: nenhuma agora; acompanhar o analytics do GTM por tráfego de navegadores antigos.

## Nits
- ⚪ `app/globals.css:11`, o comentário do `@layer base` explica bem o porquê; o seletor `[role="button"]` não tem uso atual no código (os `div` das setas dos carrosséis têm `cursor-pointer` próprio), mas está previsto na spec (AC-2), então tudo certo.
- ⚪ `components/BtnWhats.tsx:28`, `hover:drop-shadow-xl` permanece; confirmar que o `drop-shadow-xl` do v4 (valor levemente diferente do v3) foi coberto pelos prints do `/check verify`. A spec relata que passou.
- ⚪ `package.json`, `@tailwindcss/postcss` e `tailwindcss` em `^4.3.3` com `postcss` mantido: correto e consistente com o AC-1.

## Strengths
- `focus:ring` virou `focus:ring-3`, preservando o anel de 3px; `bg-white` explícito nos campos compensa o reset de `input` do v4; `md:leading-7` no `CardDepositions` preserva a altura de linha que o `md:text-xl` impunha no v3. São as armadilhas reais dessa migração e todas foram tratadas.
- `source(none)` com `@source` limitados a `app/` e `components/` evita que o Tailwind varra `docs/` e `.claude/` e gere CSS de classes que só aparecem em specs.
- Cores da marca continuam como hex fixos e não foi criado `@theme` nem bloco de compatibilidade, respeitando o AGENTS.md.
- `package-lock.json` contém os binários `@tailwindcss/oxide-linux-x64-gnu/musl` e `lightningcss-linux-x64-gnu/musl` (e demais plataformas), evitando a falha de deploy na Vercel que o AGENTS.md alerta.

## Test coverage
Projeto sem suíte por decisão (`none-by-design`); o portão é lint + build + `/check verify`, que já passou nos 8 ACs. Nada a acrescentar.
