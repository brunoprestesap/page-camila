# Scope: Site da Dra. Camila Neiva

Landing page estática da Dra. Camila Neiva, médica psiquiatra em Macapá/AP, voltada a pacientes que procuram atendimento e agendam pelo WhatsApp. Esta fatia atualiza o Next.js e todas as bibliotecas para as versões atuais, sem mudar o que o visitante vê.

**Build approach:** Tracer Bullet (cada passo deixa o site inteiro funcionando, com build e páginas no ar, antes do próximo).
**Workflow:** Alpha (depois do `/develop`, roda `/check verify` no app real). É o nível padrão de rigor do projeto. O `/architect` é a primeira parada recomendada para uma feature com decisão real, mas você pode pular quando já sabe como construir. Qualquer feature pode ter sua própria tag (ex.: `· GA`) para fazer mais ou menos.

_São recomendações para manter a construção organizada, não exigências. Pule o que não fizer sentido: se você já sabe como construir uma feature, use `/develop` e pule o `/architect`. Você decide quando uma feature está `done`._

## At a glance

| # | Feature | Phase | Status |
|---|---------|-------|--------|
| A | Landing page (seções) | Existing | existing |
| B | Política de privacidade | Existing | existing |
| C | Contato pelo WhatsApp | Existing | existing |
| D | Rastreamento (GTM e Meta Pixel) | Existing | existing |
| E | Aviso de cookies | Existing | existing |
| 1 | Atualizações seguras na mesma major | Slice 1 | done |
| 2 | Next.js 16 e React 19 | Slice 2 | done |
| 3 | Corrigir inicialização dupla do Meta Pixel | Slice 2 | in-progress |
| 4 | Lint no formato novo do ESLint | Slice 3 | done |
| 5 | Tailwind CSS 4 | Slice 4 | planned |

## Existing

Funcionalidades que já estavam no ar antes deste workflow. Ficam aqui só para dar contexto.

### A. Landing page (seções) · existing
Página principal com as seções em sequência: hero, tratamentos, diferenciais, apresentação, depoimentos, marca, vídeos, chamada para agendar, contato e rodapé. code in `app/page.tsx`, `components/`

### B. Política de privacidade · existing
Página com a política de privacidade do site. code in `app/politica-de-privacidade/`

### C. Contato pelo WhatsApp · existing
Botão flutuante e chamadas de agendamento que abrem o WhatsApp da clínica. code in `components/BtnWhats.tsx`, `components/Hero.tsx`, `components/FormCta.tsx`

### D. Rastreamento (GTM e Meta Pixel) · existing
Google Tag Manager na página principal, evento de clique no WhatsApp e Meta Pixel. code in `app/page.tsx`, `components/MetaPixel.tsx`

### E. Aviso de cookies · existing
Barra de aceite de cookies, com o aceite salvo no navegador. code in `components/CookieNotice.tsx`

## Slice 1: Atualizações seguras

### 1. Atualizações seguras na mesma major · done
Levar cada dependência à última versão dentro da major atual (Next 14.2.x, Tailwind 3.4.x, TypeScript 5.9, react-icons, postcss) e alinhar `@types/node` ao Node 24 que o projeto usa. Fecha falhas de segurança conhecidas e reduz o salto dos passos seguintes.
**Done when:** `npm install` sem avisos de vulnerabilidade alta, build e lint passam, e as duas páginas aparecem iguais a antes no desktop e no celular.
- [x] Build it: `/develop atualizações seguras na mesma major`
code in `package.json`, `package-lock.json`

## Slice 2: Next.js 16 e React 19

### 2. Next.js 16 e React 19 · done
Subir Next.js, React, React DOM, `@next/third-parties` e os tipos do React para as versões atuais, mantendo a exportação estática.
**Done when:** o build gera o site estático em `out/`, as duas páginas renderizam iguais a antes, o GTM carrega e o evento de clique no WhatsApp continua sendo enviado.
- [x] Design it (spec): `/architect Next.js 16 e React 19`
- [x] Build it: `/develop Next.js 16 e React 19`
  - [x] Linha de base do Next 14 (prints, console, rede, audit e cópia do `out/`) · AC-1, AC-2, AC-3, AC-7
  - [x] Dependências no Next 16 e React 19, build com Turbopack passando · AC-1, AC-2
  - [x] Ponte do lint (`eslint app components --max-warnings 0`) · AC-8
  - [x] Verificação contra a linha de base (visual, GTM, WhatsApp, cookies, console no build e no dev) · AC-3, AC-4, AC-5, AC-6, AC-7
- [x] Verify it: `/check verify Next.js 16 e React 19`
spec [0001](../specs/0001-nextjs-16-react-19/index.md) · code in `package.json`, `package-lock.json`, `tsconfig.json`

### 3. Corrigir inicialização dupla do Meta Pixel · in-progress
O pixel hoje é iniciado no `useEffect` e de novo no `<Script>`, o que pode contar o PageView duas vezes. Corrigir junto com a mudança nos scripts de terceiros.
**Done when:** cada carregamento de página dispara um único PageView do Meta Pixel, e o fallback sem JavaScript continua presente.
- [ ] Build it: `/develop corrigir inicialização dupla do Meta Pixel`
  - [x] `useEffect` removido; o pixel é iniciado só pelo `<Script>`, com o `<noscript>` mantido
  - [ ] Pausar a tag 19 (HTML personalizado, init + PageView do mesmo pixel) no container `GTM-KMRWN8G3`. Decisão: o código é o dono do pixel. Feito no painel do GTM, fora do repo
- [ ] Verify it: `/check verify corrigir inicialização dupla do Meta Pixel`
code in `components/MetaPixel.tsx`

## Slice 3: Lint

### 4. Lint no formato novo do ESLint · done
O Next 16 remove o comando `next lint`, então o projeto precisa passar a usar o ESLint direto, com a configuração no formato novo (flat config) e a versão atual do `eslint-config-next`.
**Done when:** `npm run lint` roda o ESLint atual sem erros e com as mesmas regras do Next (core web vitals) de antes.
- [x] Design it (spec): `/architect lint no formato novo do ESLint`
- [x] Build it: `/develop lint no formato novo do ESLint`
  - [x] Linha de base (audit, lista do `out/`, saída do lint atual) · AC-1, AC-8
  - [x] ESLint 10 com flat config rodando de ponta a ponta, `.eslintrc.json` removido · AC-1, AC-2, AC-3
  - [x] `CookieNotice` com `useSyncExternalStore`, lint verde · AC-2, AC-5, AC-6
  - [x] Lint no `prebuild` e build conferido · AC-4, AC-8
  - [x] Verificação no navegador e no preview da Vercel · AC-5, AC-6, AC-7. O Node do projeto na Vercel passou de 20.x (descontinuado, fazia todo deploy falhar) para 24.x
- [x] Verify it: `/check verify lint no formato novo do ESLint`
spec [0002](../specs/0002-lint-eslint-flat-config.md) · code in `eslint.config.mjs`, `package.json`, `package-lock.json`, `components/CookieNotice.tsx`

## Slice 4: Tailwind CSS 4

### 5. Tailwind CSS 4 · needs a decision
Migrar para o Tailwind 4, que move a configuração para dentro do CSS e troca o plugin do PostCSS.
**Done when:** não existe mais `tailwind.config.ts` (ou ele é só legado documentado), as cores, sombras, bordas e espaçamentos das duas páginas ficam iguais a antes no desktop e no celular, e o build passa.
- [ ] Design it (spec): `/architect Tailwind CSS 4`

## Deferred
Fora desta passada, guardado para o plano continuar honesto.
- **TypeScript 7**: o novo compilador nativo, quando o Next e as ferramentas suportarem bem · needs a decision
- **`next.config.ts`**: converter o `next.config.mjs` para TypeScript quando alguém mexer na configuração por outro motivo. Vem do follow-up da spec [0001](../specs/0001-nextjs-16-react-19/index.md)
- **Regras de TypeScript no lint**: avaliar o conjunto `eslint-config-next/typescript` como decisão separada · needs a decision. Vem do follow-up da spec [0002](../specs/0002-lint-eslint-flat-config.md)
- **Avisos de peer e audit do lint**: revisar quando os plugins do `eslint-config-next` lançarem versões com suporte ao ESLint 10. Vem do follow-up da spec [0002](../specs/0002-lint-eslint-flat-config.md)
- **React Compiler**: reavaliar se o site ganhar componentes de cliente com estado mais pesado · needs a decision. Vem do follow-up da spec [0001](../specs/0001-nextjs-16-react-19/index.md)

## Legend

**A caixa de decisão.** Toda feature tem exatamente uma, a subtarefa cujo rótulo termina em `(spec)`. O texto pode variar, então as skills a encontram por esse sufixo `(spec)`, nunca pelo rótulo exato. Todas as outras caixas são de execução, e o `/architect` nunca marca nenhuma delas.

**Ciclo de vida da feature**: o escopo se atualiza conforme a feature avança. Cada linha mostra o estado e quem o define:

| State | Set by | The feature shows |
|---|---|---|
| `planned` · needs a decision | `/scope` | uma caixa: `Design it (spec): /architect <feature>` |
| `in-progress` (designed) | **`/architect` ao gravar a spec** | `Design it` marcado; spec linkada; `Build it: /develop <feature>` + **2 a 5 marcos**; a caixa de fechamento do nível (`Verify it` no Alpha) |
| `in-progress` (building) | `/develop` | os marcos vão sendo marcados; ponteiro de código preenchido |
| `in-progress` (verified) | `/check verify` | `Build it` e marcos marcados; `Verify it` marcado |
| `done` | **você, quando decidir** (qualquer skill marca quando você pedir); o `/sync` reconcilia | as caixas que você rodou marcadas, as puladas indicadas; no Alpha o ponto sugerido para fechar é depois do `/check verify` |

- **Próximo passo** = a primeira caixa não marcada (sempre um comando ou um marco).
- **needs a decision** = rode o `/architect` primeiro; senão vá direto ao `/develop`. A tag sai quando a spec é gravada.
- **As tarefas atômicas ficam no `## Build plan` da spec, não aqui**: o escopo guarda só o resumo dos marcos.
- **Status** `planned` → `in-progress` → `done`, mais `existing` (anterior ao workflow) e `dropped` (fora do escopo, guardado como histórico).
- **Tag de abordagem** ao lado do título (ex.: `· Facade`) troca a abordagem padrão só daquela feature; sem tag, herda a padrão.
- **Tag de nível de workflow** ao lado do título (ex.: `· GA`, `· Prototype`) muda o rigor só daquela feature; sem tag, herda o padrão.
- **Workflow** (linha do cabeçalho) é o padrão do projeto, o que roda depois do `/develop`: **Prototype** = nada; **Alpha** = `/check verify`; **Beta** = `/check verify` e depois `/test`; **GA** = acrescenta `/check review` com outro modelo e depois `/document`. Uma feature construída sobre uma decisão não ratificada (spec `Assumed`) continua sinalizada, mas isso nunca impede o `done`.
- **Linha de ponteiro** (`spec <n> · code in <path>`): o link da spec entra pelo `/architect`, o caminho do código pelo `/develop`.
