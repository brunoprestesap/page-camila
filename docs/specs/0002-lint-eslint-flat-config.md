# 0002. Lint com ESLint 10 e configuração no formato novo

**Date**: 2026-10-13
**Status**: Accepted

## Summary

Esta decisão troca a ponte provisória do lint (ESLint 8 com `eslint-config-next@14`) pelo ESLint 10 com o `eslint-config-next@16`, configurado no formato novo do ESLint (flat config, um arquivo `eslint.config.mjs` em JavaScript no lugar do `.eslintrc.json`). As regras continuam as mesmas de antes (`core-web-vitals`), o lint passa a olhar o projeto inteiro e roda sozinho antes de todo build, inclusive na Vercel. A única regra nova que reprova o código atual aponta o `CookieNotice`, que passa a ler o aceite dos cookies com `useSyncExternalStore` (o jeito do React de ler dados de fora dele) sem mudar nada do que o visitante vê.

## Context

O Next 16 removeu o comando `next lint`, e o `next build` não roda mais o lint. A spec [0001](0001-nextjs-16-react-19/index.md) deixou uma ponte mínima para não travar o salto de versão: o script `lint` chama `eslint app components --max-warnings 0` com o ESLint 8 e o `eslint-config-next@14`, lendo o `.eslintrc.json` antigo. Essa ponte tem três problemas. O ESLint 8 já não recebe correções. As regras do Next são de duas versões atrás, então nenhuma regra nova do Next 16 é aplicada. E, como o build não chama mais o lint, um erro de lint chega ao `out/` (a pasta com o site gerado) sem ninguém perceber.

O site é estático, publicado pela Vercel a partir do git. A Vercel instala as dependências de desenvolvimento e roda `npm run build` a cada push, então qualquer coisa ligada ao build roda lá também. O Node do projeto é o 24.

Um teste numa cópia do projeto (ESLint 9 e 10, com `eslint-config-next@16.4.0` e o conjunto `core-web-vitals`) mostrou quatro fatos. O ESLint 9 já aparece no npm como fora de suporte. O ESLint 10 instala sem `--legacy-peer-deps`, só com avisos de dependência parceira (peer dependency, quando um pacote declara com qual versão de outro ele funciona) em `eslint-plugin-import`, `eslint-plugin-jsx-a11y` e `eslint-plugin-react`. Uma única regra nova reprova o código atual: `react-hooks/set-state-in-effect`, em `components/CookieNotice.tsx:12`, que chama `setAccepted(true)` dentro de um `useEffect`. E o `npm audit` fica igual antes e depois (10 alertas, 2 moderados e 8 altos). Parte vem do Tailwind 3, assunto da feature 5. A outra parte vem do próprio `@next/eslint-plugin-next@16.4.0`, pela cadeia `fast-glob`, depois `micromatch` e `braces`, e o `braces@3.0.3` já é a última versão publicada.

O `CookieNotice` decide se a barra de cookies aparece e em que altura fica o botão do WhatsApp (ver `AGENTS.md`). É um comportamento que a verificação da spec 0001 conferiu (AC-6 de lá) e que não pode mudar.

## Requirements

**User stories**:
- Como mantenedor do site, quero o lint numa versão mantida e com as regras atuais do Next, para pegar problemas que o Next 16 já sabe apontar.
- Como mantenedor, quero que um erro de lint impeça o build, para que ele nunca chegue ao site no ar.
- Como visitante, quero que a barra de cookies continue funcionando igual.

**Acceptance criteria**:
- **AC-1**: o `package.json` declara `eslint` em `^10.12.0` e `eslint-config-next` em `^16.4.0`. O `.eslintrc.json` não existe mais, e existe um `eslint.config.mjs` na raiz que usa `eslint-config-next/core-web-vitals` e os ignores padrão do Next. O `npm install` termina sem `--legacy-peer-deps` e sem erro. Os avisos de peer de `eslint-plugin-import`, `eslint-plugin-jsx-a11y` e `eslint-plugin-react` são aceitos. O `npm audit` não piora em relação à linha de base: o conjunto de pares (pacote, alerta e gravidade) do `npm audit --json` novo está contido no da linha de base.
- **AC-2**: `npm run lint` roda `eslint . --max-warnings 0` com o ESLint 10 e passa sem erros nem avisos. Ele verifica `app/`, `components/` e os arquivos de configuração da raiz (`next.config.mjs`, `postcss.config.mjs`, `tailwind.config.ts`, `eslint.config.mjs`), e ignora `.next/`, `out/`, `build/`, `next-env.d.ts`, `.claude/` e `node_modules/`.
- **AC-3**: as regras ativas são as do `core-web-vitals` do Next 16, sem o conjunto de TypeScript. `npx eslint --print-config components/Hero.tsx` mostra `@next/next/no-img-element`, `react-hooks/rules-of-hooks` e `react-hooks/set-state-in-effect` ativas. Um `<img>` colocado de propósito em `components/Hero.tsx` faz o `npm run lint` falhar, e esse `<img>` de teste é removido em seguida.
- **AC-4**: o `package.json` tem o script `"prebuild": "npm run lint"`. O `npm run build` roda o lint antes do `next build`. Com um erro de lint colocado de propósito, o build termina com código de saída diferente de zero antes de o `next build` começar, e o erro de teste é removido em seguida.
- **AC-5**: o `CookieNotice` não chama mais `setState` dentro de `useEffect` e lê o aceite com `useSyncExternalStore`. O comportamento é o mesmo da spec 0001 (AC-6 de lá). Sem aceite salvo, a barra aparece e o botão do WhatsApp fica acima dela. Ao clicar em Aceitar, a barra some e o botão desce. Ao recarregar, a barra não volta. O console não mostra erro de hidratação (quando o React assume o HTML pronto no navegador) nem erro novo, tanto no `out/` servido quanto no `npm run dev`.
- **AC-6**: com o `localStorage` bloqueado, a página não quebra. Isso vale em dois casos: quando `getItem` e `setItem` lançam erro, e quando o próprio acesso a `window.localStorage` lança erro (como em alguns navegadores com cookies bloqueados). A barra aparece, clicar em Aceitar esconde a barra até a página ser recarregada, e o console não mostra erro sem tratamento.
- **AC-7**: o build de preview na Vercel, feito a partir do push da branch `feature/lint-eslint-10`, mostra no log o `prebuild` rodando o lint antes do `next build` e termina com sucesso.
- **AC-8**: o `npm run build` gera em `out/` o mesmo conjunto de arquivos da linha de base. A comparação é exata para os HTML e os arquivos vindos de `public/`, e deixa de fora `_next/static/`, cujos nomes têm hashes que mudam a cada build.

## Options considered

### Option 1: ESLint 10 com flat config e as regras atuais, corrigindo o código

Atualizar para o ESLint 10 e o `eslint-config-next@16`, escrever o `eslint.config.mjs` como o guia do Next 16 mostra, lintar o projeto todo, corrigir o `CookieNotice` para cumprir a regra nova e ligar o lint ao build pelo `prebuild`.

**Pros**:
- Versão mantida do ESLint e regras atuais do Next e do React.
- Nenhuma exceção no código nem na configuração.
- O build passa a barrar erros de lint, na máquina e na Vercel.

**Cons**:
- Mexe num componente que funciona (o `CookieNotice`), então precisa de verificação no navegador.
- Convive com avisos de peer até os plugins declararem suporte ao ESLint 10.
- Cada build fica alguns segundos mais lento.

### Option 2: ESLint 9 com flat config

Mesma migração, mas no ESLint 9, que instala sem nenhum aviso de peer.

**Pros**:
- Instalação limpa, sem avisos.

**Cons**:
- O ESLint 9 já está fora de suporte. Seria preciso migrar de novo em breve, o mesmo problema que esta feature resolve.

### Option 3: Migrar e desligar a regra nova

ESLint 10 e flat config, mas com `react-hooks/set-state-in-effect` desligada (na linha ou no projeto), sem tocar no `CookieNotice`.

**Pros**:
- Não mexe em nenhum componente. Risco quase zero para o visitante.

**Cons**:
- Deixa uma exceção que esconde exatamente o padrão que a regra existe para pegar. Desligada no projeto, perde o aviso em todo componente futuro.

### Option 4: Manter a ponte e só ligar o lint ao build

Ficar no ESLint 8 e no `eslint-config-next@14`, só adicionando o `prebuild`.

**Pros**:
- Nenhuma mudança de dependência.

**Cons**:
- Fica numa versão sem correções e com regras de duas versões atrás. Só adia o trabalho.

## Decision

**Chosen option**: Option 1: ESLint 10 com flat config e as regras atuais, corrigindo o código

O projeto passa a usar o ESLint 10 com `eslint-config-next@16` e `core-web-vitals` num `eslint.config.mjs`, linta tudo com `eslint . --max-warnings 0`, roda o lint no `prebuild` e corrige o `CookieNotice` com `useSyncExternalStore`.

## Rationale

O motivo de existir esta feature é sair de uma versão sem suporte. Escolher o ESLint 9, que já está fora de suporte, repetiria o problema. Os avisos de peer do ESLint 10 são só isso, avisos: a instalação funciona sem flag e o lint roda certo, como o teste mostrou. O próprio guia do Next 16 avisa que alguns plugins ainda não listam o ESLint 10. Quando eles atualizarem, os avisos somem sem nenhum trabalho daqui.

Corrigir o `CookieNotice` em vez de desligar a regra vale porque a regra aponta um problema real. Hoje o componente renderiza, roda o efeito e renderiza de novo só para ler o `localStorage`. O `useSyncExternalStore` é a forma que o React indica para ler um dado de fora dele. Ele usa o valor do servidor (`false`, barra visível) na hidratação, então o HTML estático continua batendo, e logo em seguida lê o valor real, sem o efeito no meio. O risco é baixo porque o componente é pequeno, e o comportamento é conferido no navegador com o mesmo roteiro da spec 0001. A alternativa mais próxima, desligar a regra só naquela linha, fica como saída se a correção mostrar algum problema no verify.

O `prebuild` fecha a brecha que a spec 0001 registrou como consequência negativa. Como a Vercel roda `npm run build`, o npm chama o `prebuild` sozinho, e um erro de lint impede o deploy sem nenhuma configuração na Vercel. O custo são alguns segundos por build num site de 26 arquivos. Lintar o projeto todo, em vez de só `app` e `components`, também cobre os arquivos de configuração, e o teste mostrou que eles já passam.

## Feature design

**Data model sketch**: não se aplica, a mudança não toca dados. O único estado é o aceite de cookies, que continua na chave `cookieAccepted` do `localStorage`, com o valor `"true"`.

**API surface**: o site é estático e não tem rotas. As interfaces que mudam são estas:

| Interface | Como fica |
|---|---|
| `npm run lint` | `eslint . --max-warnings 0` |
| `npm run build` | roda o `prebuild` (`npm run lint`) e depois o `next build` |
| `eslint.config.mjs` | `defineConfig([...nextVitals, globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", ".claude/**"])])`, com `nextVitals` vindo de `eslint-config-next/core-web-vitals` e `defineConfig` e `globalIgnores` de `eslint/config` |
| `CookieNotice` | mesmo componente e mesma marcação. Só muda a forma de ler e gravar o aceite |

**Desenho do `CookieNotice`** (já testado numa cópia do projeto: passa no lint novo e no `tsc`):
- O estado `accepted` vem de `useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)`. O `useEffect` e o `useState` saem.
- `getServerSnapshot` devolve `false`, igual ao estado inicial de hoje, para o HTML estático e a hidratação não mudarem.
- `getSnapshot` devolve `true` se uma variável do módulo `acceptedInMemory` for `true`, senão `Boolean(localStorage.getItem("cookieAccepted"))` dentro de `try`/`catch` (no erro, `false`). Isso mantém a regra de hoje, em que qualquer valor salvo conta como aceite.
- `subscribe` escuta na janela o evento próprio `cookie-accepted` e o evento `storage` (para o aceite feito em outra aba valer aqui), sem filtrar pela chave, já que o `getSnapshot` recalcula o valor a cada vez. Ele devolve a função que remove os dois listeners.
- `acceptCookies` liga `acceptedInMemory`, tenta `localStorage.setItem("cookieAccepted", "true")` dentro de `try`/`catch` e dispara `window.dispatchEvent(new Event("cookie-accepted"))`.
- O acesso ao `localStorage` fica inteiro dentro do `try`, porque em alguns navegadores o simples acesso a `window.localStorage` já lança erro.
- O `acceptedInMemory` vale até a página recarregar. Se outra aba apagar a chave, esta aba continua mostrando o aceite. É intencional.

**Value sourcing**:
| Action | Value produced / displayed | Source |
|---|---|---|
| `npm install` | versões do ESLint e da config do Next | `package.json` (AC-1), resolvidas no `package-lock.json` |
| `npm run lint` | regras aplicadas | `eslint.config.mjs` com `eslint-config-next/core-web-vitals` (AC-3) |
| `npm run lint` | arquivos verificados e ignorados | o `.` do script mais o `globalIgnores` do `eslint.config.mjs`. O `node_modules/` é ignorado pelo próprio ESLint (AC-2) |
| `npm run lint` | limite de avisos | `--max-warnings 0` no script |
| `npm run build` | lint antes do build | script `prebuild` (AC-4), chamado pelo npm antes do `build` |
| Build na Vercel | comando rodado | o comando de build padrão do projeto na Vercel (`npm run build`). Se o projeto tiver um comando próprio que chame `next build` direto, o `prebuild` não roda. O AC-7 confere isso no log |
| `npm audit` | linha de base de comparação | `npm audit --json` salvo antes da troca, no passo 1 do Build plan, na pasta temporária da sessão. A comparação usa os pares (pacote, alerta e gravidade) |
| Carregar a página | barra visível ou não | `getServerSnapshot` (`false`) na hidratação, depois `getSnapshot` (memória ou `localStorage`, chave `cookieAccepted`) |
| Clicar em Aceitar | barra some, botão desce | `acceptedInMemory`, gravação no `localStorage` e aviso aos callbacks |
| Verificação no navegador | servidor e páginas | `npx serve out -l 3000`, `http://localhost:3000/` e `npm run dev`, como na spec 0001 |
| Verificação AC-6 | `localStorage` bloqueado | dois scripts de inicialização no Playwright MCP: um troca `Storage.prototype.getItem` e `setItem` por funções que lançam erro, o outro redefine `window.localStorage` com um getter que lança erro |
| Build na Vercel | versão do Node | a configuração de Node do projeto na Vercel, conferida pelo Vercel MCP antes do push. Precisa ser `^20.19`, `^22.13` ou `>=24`. Não se adiciona `engines` ao `package.json`, porque a Vercel usa esse campo para escolher o Node |
| Preview na Vercel | branch, push e log | branch `feature/lint-eslint-10`. O push é feito por você, ou pelo agente depois de pedir sua permissão. O log é lido pelo Vercel MCP |
| Comparação do `out/` | lista de arquivos de referência | lista do `out/` salva no passo 1 do Build plan, sem `_next/static/` |

**Key invariants**:
- O HTML estático da página principal continua com a barra de cookies visível (o servidor não sabe do aceite).
- Nenhum `eslint-disable` no código e nenhuma regra desligada na configuração.
- `eslint-config-next` acompanha a versão do `next` (as duas em 16.4).
- Nada de `--legacy-peer-deps`, `.npmrc` com `legacy-peer-deps` ou `overrides` para calar os avisos de peer.
- O `package-lock.json` é gerado pelo mesmo npm da máquina de desenvolvimento e entra no commit, para a Vercel instalar a mesma árvore.
- O commit desta feature leva o código, o `package.json`, o `package-lock.json`, a spec e o scope. A pasta `.claude/` fica fora.

**Security model**: sem mudança de acesso. Os alertas do `npm audit` ficam numa exceção aceita, porque são só de ferramentas de desenvolvimento (lint e Tailwind) que rodam sobre o código do próprio projeto. A correção do `braces` não existe ainda, e a parte do Tailwind é da feature 5.

**Configuration required**: nenhuma variável de ambiente nova. Nenhuma mudança nas configurações do projeto na Vercel.

**Critical test scenarios**:
- Caminho feliz: `npm install`, `npm run lint` verde e `npm run build` mostrando o lint antes do `next build`, verifica **AC-1**, **AC-2**, **AC-4**, **AC-8**
- Regras ativas: `--print-config` e o `<img>` de teste reprovando, verifica **AC-3**
- Build barrado: erro de lint de teste faz o build parar antes do `next build`, verifica **AC-4**
- Barra de cookies: sem aceite, aceitar, recarregar, no `out/` e no `dev`, verifica **AC-5**
- Falha: `localStorage` bloqueado não quebra a página e o Aceitar ainda esconde a barra, verifica **AC-6**
- Deploy: preview da Vercel com o lint no log, verifica **AC-7**

## Build plan

Abordagem Tracer Bullet (do cabeçalho do scope): primeiro o lint novo roda de ponta a ponta e mostra o erro esperado, depois o código fica verde, depois o lint entra no build, e por fim a verificação real.

1. Linha de base: salvar o `npm audit --json`, a lista de arquivos do `out/` de um `npm run build` e a saída do `npm run lint` atual, na pasta temporária da sessão, satisfies **AC-1**, **AC-8**
2. Lint novo de ponta a ponta: trocar `eslint` para `^10.12.0` e `eslint-config-next` para `^16.4.0`, criar o `eslint.config.mjs`, remover o `.eslintrc.json` e trocar o script para `eslint . --max-warnings 0`. O resultado esperado é exatamente um erro (`react-hooks/set-state-in-effect` no `CookieNotice`), satisfies **AC-1**, **AC-2**, **AC-3**
3. Corrigir o `CookieNotice` com `useSyncExternalStore` conforme o desenho acima, deixando o lint verde, satisfies **AC-2**, **AC-5**, **AC-6**
4. Ligar o lint ao build com o script `prebuild` e conferir o build normal e o build barrado por um erro de teste, satisfies **AC-4**, **AC-8**
5. Verificar no navegador (barra de cookies no `out/` e no `dev`, `localStorage` bloqueado nos dois casos), conferir o Node do projeto na Vercel e, com sua permissão para o push, validar o preview da branch `feature/lint-eslint-10`, satisfies **AC-5**, **AC-6**, **AC-7**

## Consequences

**Positive**:
- Lint numa versão mantida, com as regras atuais do Next 16 e do React 19.
- Um erro de lint não chega mais ao site no ar: o build para, na máquina e na Vercel.
- O `CookieNotice` deixa de renderizar duas vezes na carga e passa a sincronizar o aceite entre abas.
- Fecha a ponte da spec 0001 e o alerta dela sobre o build não rodar o lint.

**Negative / tradeoffs**:
- O `npm install` mostra avisos de peer em três plugins até eles declararem suporte ao ESLint 10.
- O `npm audit` continua com os mesmos alertas altos. A parte do lint agora vem do `@next/eslint-plugin-next@16` (como antes vinha do 14), e não há correção disponível por enquanto.
- Cada `npm run build` fica alguns segundos mais lento, e um erro de lint bloqueia até um deploy urgente. Para passar por cima numa emergência, você precisa corrigir o erro (não existe atalho previsto, de propósito).
- O ESLint 10 exige Node `^20.19`, `^22.13` ou `>=24`. Se a Vercel estiver configurada com um Node mais antigo, o build falha. O preview do AC-7 confirma.

**Neutral**:
- O `package-lock.json` muda bastante, porque troca a árvore inteira do ESLint.
- O formato novo de configuração usa JavaScript, igual ao `next.config.mjs`.

## Follow-up

- [ ] Opcional: avaliar o conjunto `eslint-config-next/typescript` (regras do typescript-eslint) como uma decisão separada.
- [ ] Revisar os avisos de peer e o `npm audit` quando `eslint-plugin-import`, `eslint-plugin-jsx-a11y`, `eslint-plugin-react` ou `@next/eslint-plugin-next` lançarem versões novas.

