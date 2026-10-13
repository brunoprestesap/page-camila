# 0001. Atualizar para Next.js 16 e React 19

**Date**: 2026-10-13
**Status**: Accepted

## Summary

Esta decisão leva o site do Next.js 14 com React 18 para o Next.js 16 com React 19, num único salto e sem mudar nada do que o visitante vê. O site continua exportado como estático, o build passa a usar o Turbopack (o empacotador novo, padrão no Next 16), e o React Compiler fica desligado. O lint ganha só uma ponte mínima, porque a migração de verdade para o ESLint novo é a feature 4. Para provar que nada mudou, você tira prints das duas páginas antes e depois e confere o GTM no navegador.

## Requirements

**User stories**:
- Como mantenedor do site, quero o Next.js e o React nas versões atuais para continuar recebendo correções de segurança e não acumular um salto maior depois.
- Como visitante, quero que o site continue igual e funcionando, sem perceber a atualização.
- Como responsável pelas campanhas, quero que o GTM e o evento de clique no WhatsApp continuem chegando.

**Acceptance criteria**:
- **AC-1**: `package.json` declara `next` e `@next/third-parties` em `^16.4.0`, `react` e `react-dom` em `^19.3.0`, `@types/react` e `@types/react-dom` em `^19.3.0`, `npm install` termina sem conflito de dependências parceiras (sem `--legacy-peer-deps`), e `npm audit --omit=dev --audit-level=high` não aponta nada. O resultado completo do `npm audit` (com as dependências de desenvolvimento) fica registrado antes e depois. Alertas que vêm só da cadeia congelada do ESLint 8 são uma exceção aceita até a feature 4.
- **AC-2**: `npm run build` usa o Turbopack, passa na checagem de tipos e gera em `out/` o mesmo conjunto de páginas HTML de antes (`index.html` e `politica-de-privacidade.html`), mais os arquivos de `public/assets/`. A comparação usa a lista de arquivos de `out/` salva na linha de base.
- **AC-3**: as duas páginas geradas ficam visualmente iguais aos prints tirados antes da atualização, no desktop (1440 px de largura) e no celular (390 px), com a página inteira capturada. A comparação é feita no olho, com o estado fixado da mesma forma nos dois lados (ver *Protocolo de verificação*). O mapa do Google fica fora da comparação.
- **AC-4**: na página principal servida a partir de `out/`, a requisição a `gtm.js?id=GTM-KMRWN8G3` volta com status 200, e o `window.dataLayer` contém o evento `gtm.start`.
- **AC-5**: depois de clicar no botão flutuante do WhatsApp, o `window.dataLayer` contém exatamente `{ event: "buttonClicked", value: "whatsapp" }`, e o link do botão tem `href="https://wa.me/5596991354590"` e `target="_blank"`. A verificação não navega até o WhatsApp: a aba nova é observada e fechada.
- **AC-6**: o aviso de cookies continua funcionando: sem aceite salvo, a barra aparece e o botão do WhatsApp fica acima dela; ao clicar em Aceitar, a barra some, o botão desce, e ao recarregar a barra não volta.
- **AC-7**: o console do navegador não mostra erro de hidratação nem erro novo em nenhuma das duas páginas, tanto no `out/` servido quanto no `npm run dev` (onde os erros do React aparecem por extenso). As requisições do Meta Pixel (se o `fbevents.js` carrega ou não, e as chamadas a `facebook.com/tr`) ficam iguais às do log de rede da linha de base.
- **AC-8**: `npm run lint` roda `eslint app components --max-warnings 0` (ESLint 8 com as regras `next/core-web-vitals`) e passa sem erros nem avisos. Um `<img>` colocado de propósito num componente faz o lint falhar (a regra `@next/next/no-img-element` dá aviso, e `--max-warnings 0` reprova), o que prova que os arquivos `.tsx` estão sendo lidos. O `<img>` de teste é removido em seguida.

## Decision

**Chosen option**: Option 1: Salto direto para o Next 16 e React 19, atualização manual

Atualizar `next`, `react`, `react-dom`, `@next/third-parties`, `@types/react` e `@types/react-dom` de uma vez para as versões atuais, com o Turbopack como empacotador, o React Compiler desligado, `next.config.mjs` mantido como está e uma ponte mínima no lint (ESLint 8 e `eslint-config-next@14` com o `.eslintrc.json` atual, script trocado para `eslint app components --max-warnings 0`).

## Feature design

**Data model sketch**: não se aplica, a mudança não toca dados.

**API surface**: não se aplica, o site é estático e não tem rotas de API. As interfaces que precisam continuar iguais são:

| Interface | O que precisa continuar igual |
|---|---|
| `npm run build` | gera o site estático em `out/` |
| `npm run dev` | sobe o servidor local (agora com Turbopack) |
| `npm run lint` | roda o ESLint com `next/core-web-vitals` |
| `GoogleTagManager` em `app/page.tsx` | carrega o GTM `GTM-KMRWN8G3` |
| `sendGTMEvent` em `components/BtnWhats.tsx` | envia `{ event: "buttonClicked", value: "whatsapp" }` |

**Value sourcing**:
| Action | Value produced / displayed | Source |
|---|---|---|
| `npm install` | versões das dependências | `package.json` (AC-1), resolvidas para `package-lock.json` |
| `npm run build` | empacotador usado | padrão do Next 16 (Turbopack), sem flag no script |
| `npm run build` | ajustes no `tsconfig.json` e no `next-env.d.ts` | escritos pelo próprio `next build` na primeira execução; o resultado entra no commit |
| `npm run lint` | regras aplicadas | `.eslintrc.json` atual (`next/core-web-vitals`) com `eslint-config-next@14` |
| `npm run lint` | pastas verificadas e limite de avisos | o script, `eslint app components --max-warnings 0` |
| `npm audit` | critério de vulnerabilidade | `npm audit --omit=dev --audit-level=high` (AC-1) |
| Verificação | servidor do `out/` | `npx serve out -l 3000`, sem entrar no `package.json` |
| Verificação | URLs comparadas | `http://localhost:3000/` e `http://localhost:3000/politica-de-privacidade` |
| Verificação | ferramenta dos prints | Playwright MCP da sessão (`browser_take_screenshot` com página inteira) |
| Carregar a página | ID do GTM | `app/page.tsx` (`GTM-KMRWN8G3`), sem mudança |
| Clique no WhatsApp | evento no `dataLayer` | `components/BtnWhats.tsx`, sem mudança |
| Comparação visual | prints, console, rede e lista de `out/` de referência | linha de base do passo 1 do Build plan, guardada na pasta temporária da sessão |
| Rollback | site anterior | cópia do `out/` do Next 14 feita no passo 1 (o `out/` está no `.gitignore`) |

**Protocolo de verificação** (igual na linha de base e depois da atualização):
- Servir com `npx serve out -l 3000` e abrir as duas URLs da tabela acima.
- Estado fixado: `localStorage` limpo (sem `cookieAccepted`), então a barra de cookies aparece nos dois lados; carrosséis de depoimentos e vídeos no slide inicial, sem clicar.
- Antes do print: rolar a página até o fim para carregar as imagens tardias, voltar ao topo e esperar a rede parar.
- O iframe do Google Maps em `Contact.tsx` é ignorado na comparação.
- Rede e console: guardar a lista de requisições e as mensagens do console de cada página.
- A conferência do GTM e do Meta Pixel precisa de internet e de um navegador sem bloqueador de anúncios.

**Key invariants**:
- `output: "export"` e `images.unoptimized: true` continuam em `next.config.mjs`. Nada que precise de servidor entra no projeto.
- Nenhum arquivo em `components/` ou `app/` muda de comportamento. Mudanças de código só entram se o build ou a checagem de tipos exigirem, e cada uma fica mínima.
- O Meta Pixel continua exatamente como está. A inicialização dupla é a feature 3 e não é corrigida aqui.
- `eslint` fica em `^8.57.1` e `eslint-config-next` em `^14.2.35` até a feature 4.

**Security model**: sem mudança de acesso. A atualização em si é uma melhoria de segurança: fecha as falhas corrigidas entre o 14 e o 16 e mantém o projeto numa linha que ainda recebe correções. AC-1 exige zero vulnerabilidade alta.

**Configuration required**: nenhuma variável de ambiente nova. O Node local (24) já atende o mínimo de 20.9.

**Critical test scenarios**:
- Caminho feliz: build com Turbopack, servir `out/` localmente, prints das duas páginas no desktop e no celular batem com os de antes, verifica **AC-2** e **AC-3**.
- Rastreamento: com a página servida de `out/`, conferir no navegador que o script do GTM foi requisitado e que o clique no WhatsApp entra no `dataLayer`, verifica **AC-4** e **AC-5**.
- Cookies: limpar o `localStorage`, ver a barra, aceitar, recarregar, ver a barra sumida e o botão na posição baixa, verifica **AC-6**.
- Falha de hidratação: abrir as duas páginas com o console aberto, no `out/` servido e no `npm run dev`, confirmar que não há erro novo e que as requisições do Meta Pixel batem com a linha de base, verifica **AC-7**.
- Lint: `npm run lint` passa; com um `<img>` de propósito num componente, falha por causa do `--max-warnings 0`; o `<img>` é removido, verifica **AC-8**.

## Build plan

Abordagem Tracer Bullet: cada passo deixa o site inteiro gerando e funcionando antes do próximo.

1. [x] Tirar a linha de base com o Next 14, tudo guardado na pasta temporária da sessão, fora do repositório: rodar `npm audit` (completo e com `--omit=dev --audit-level=high`), gerar o build, salvar a lista de arquivos de `out/` e uma cópia do `out/` inteiro, servir com `npx serve out -l 3000` e, seguindo o *Protocolo de verificação*, tirar os prints das duas páginas em 1440 px e 390 px e salvar o console e as requisições de rede, satisfies **AC-1**, **AC-2**, **AC-3**, **AC-7**.
2. [x] Atualizar `next`, `@next/third-parties`, `react`, `react-dom`, `@types/react` e `@types/react-dom` para as versões do AC-1 e rodar `npm install`, conferindo que não há conflito de dependências parceiras nem vulnerabilidade alta, satisfies **AC-1**.
3. [x] Apagar `.next/` e `out/`, rodar `npm run build`, aceitar os ajustes que o Next 16 fizer no `tsconfig.json` e no `next-env.d.ts`, e corrigir de forma mínima qualquer erro de tipo do React 19 ou do Turbopack. Se o build falhar, rodar uma vez `next build --webpack` só para isolar a causa, sem deixar essa flag no script, satisfies **AC-2**.
4. [x] Trocar o script `lint` de `next lint` para `eslint app components --max-warnings 0`, mantendo `eslint@^8.57.1`, `eslint-config-next@^14.2.35` e o `.eslintrc.json`, e rodar `npm run lint`, satisfies **AC-8**.
5. [x] Verificar no app real seguindo o *Protocolo de verificação*: servir o novo `out/`, tirar os mesmos prints e comparar com a linha de base, conferir o GTM e o evento do WhatsApp no `dataLayer`, o fluxo do aviso de cookies, o console e as requisições de rede das duas páginas, e repetir a conferência do console no `npm run dev`, satisfies **AC-3**, **AC-4**, **AC-5**, **AC-6**, **AC-7**.

## Consequences

**Positive**:
- O projeto volta para uma linha do Next e do React que recebe correções de segurança.
- Builds e servidor local mais rápidos com o Turbopack.
- As próximas fatias (lint e Tailwind 4) partem de uma base atual, sem empilhar saltos.

**Negative / tradeoffs**:
- O lint fica numa ponte temporária: ESLint 8, que já não é a versão mantida, e `eslint-config-next@14` com regras de duas majors atrás. Até a feature 4, uma regra nova do Next 16 não é aplicada.
- O `next build` não roda mais o lint. Se você esquecer o `npm run lint`, um erro de lint chega ao `out/` sem aviso.
- O salto único concentra três mudanças (Next, React, Turbopack). Se algo quebrar, isolar a causa leva mais tempo do que num passo a passo.
- A prova visual é por prints comparados, não por um teste automatizado que fica no repositório. Ela vale para este salto, não protege mudanças futuras.

**Neutral**:
- O `next build` reescreve o `tsconfig.json` (por exemplo, o `jsx` passa de `preserve` para `react-jsx`, e o `include` ganha `.next/dev/types/**/*.ts`) e o `next-env.d.ts` (que está no `.gitignore`). São mudanças automáticas e esperadas.
- O `next dev` passa a guardar seus arquivos numa pasta separada dentro de `.next/`, e você pode rodar `dev` e `build` ao mesmo tempo.
- O `AGENTS.md` cita `next lint` só de forma indireta. Quando o script mudar, o `/sync` atualiza os comandos.

## Migration plan

**Strategy**: big bang (salto único), com rollback pelo Git.
**Phases**:
1. Linha de base visual com o Next 14 (Build plan, passo 1).
2. Atualização das dependências, build, lint e verificação num único commit (passos 2 a 5).
3. Gerar o `out/` final e enviar para a hospedagem só depois que a verificação do passo 5 passar.
**Rollback**: como o site é estático e enviado à mão, a hospedagem só muda quando você sobe o novo `out/`. Se algo der errado depois de publicado, reverta o commit (`package.json`, `package-lock.json`, `tsconfig.json` e o script de lint), e suba a cópia do `out/` do Next 14 guardada no passo 1 (ou rode `npm install` e `npm run build` para gerá-la de novo).
**Risks**:
- Um erro de tipo do `@types/react@19` em algum componente. É pouco provável: o `tsc --noEmit` passa hoje, e o código não usa `JSX` global nem `useRef` sem argumento. Se aparecer, a correção é mínima e local, sem mudar o comportamento.
- Diferença visual sutil causada por ordem de CSS diferente no Turbopack. Os prints de página inteira pegam isso.
- O React 19 é mais rígido com diferenças entre o HTML gerado e o primeiro render no navegador. O `CookieNotice` lê o `localStorage` dentro de um efeito, o que é seguro, mas vale conferir o console (AC-7).

## Follow-up

- [ ] Feature 3: corrigir a inicialização dupla do Meta Pixel, agora sobre o React 19.
- [ ] Feature 4: trocar a ponte do lint pelo ESLint 9 com flat config e `eslint-config-next@16`, e remover o `.eslintrc.json`.
- [ ] Opcional: converter `next.config.mjs` para `next.config.ts` quando alguém mexer na configuração por outro motivo.
- [ ] Opcional: reavaliar o React Compiler se o site ganhar componentes de cliente com estado mais pesado.
## Rationale

Contexto, opções e justificativa: veja [rationale.md](rationale.md).
