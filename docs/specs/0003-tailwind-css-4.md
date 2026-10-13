# 0003. Migrar para o Tailwind CSS 4

**Date**: 2026-10-13
**Status**: In Progress

## Summary

Esta decisão leva o site do Tailwind CSS 3.4 para o 4.3, usando a ferramenta oficial de migração (`npx @tailwindcss/upgrade`) e revisando o resultado arquivo por arquivo. A configuração sai do `tailwind.config.ts` e passa a morar no próprio `app/globals.css`, e o plugin do PostCSS (a etapa que transforma o CSS no build) vira o pacote `@tailwindcss/postcss`. O visual das duas páginas fica igual, com duas mudanças aceitas de propósito: aparelhos anteriores a 2023 (Safari abaixo de 16.4) deixam de ser atendidos, e no celular o efeito de hover não fica mais preso depois do toque. A prova é a mesma da spec 0001: prints antes e depois, comparados no olho.

## Context

O projeto usa o Tailwind 3.4, que só recebe correções. Parte dos alertas do `npm audit` registrados na spec [0002](0002-lint-eslint-flat-config.md) vem da cadeia de dependências do Tailwind 3. A configuração atual é mínima: o `tailwind.config.ts` lista as pastas `app/` e `components/` e define duas imagens de fundo (`gradient-radial` e `gradient-conic`) que nenhum componente usa. O `postcss.config.mjs` só chama o plugin `tailwindcss`, e o `globals.css` tem as três diretivas `@tailwind` mais uma classe `.cookie-notice` que nenhum componente usa.

O Tailwind 4 muda coisas que este código usa:
- Só funciona a partir do Safari 16.4, Chrome 111 e Firefox 128. Em navegadores mais antigos o CSS gerado não se aplica direito.
- O `bg-opacity-*` deixou de existir. Ele aparece em `components/Brand.tsx`, `app/politica-de-privacidade/page.tsx` (junto de `bg-white`, dando branco a 60%) e em `components/Hero.tsx` (junto de `bg-white/50`, onde já não tem efeito).
- O `ring` passa de 3px para 1px. Os quatro campos do formulário em `components/Contact.tsx` usam `focus:ring focus:ring-[#003E53]`.
- Os botões passam a usar a seta padrão do navegador em vez da mãozinha.
- O `hover:` passa a valer só em aparelhos com mouse (dentro de `@media (hover: hover)`). Cards em `CardExperience`, `CardBeneficios`, `VideoPlayer` e o botão em `FormCta` sobem no hover.
- A cor padrão da borda passa de cinza claro para a cor do texto. Todo uso de borda no projeto já declara a cor, então isso não muda nada aqui.
- A escala de desfoque muda de nome: o `backdrop-blur-sm` (4px) do v3 vira `backdrop-blur-xs` no v4. Ele aparece em `components/Apresentation.tsx` (`md:backdrop-blur-sm`).
- A paleta padrão (`stone`, `slate`, `gray`) passa a ser definida em oklch (um jeito novo de descrever cor), com tons levemente diferentes. São cerca de 18 usos em textos e sombras. As cores da marca, em hex, não mudam.
- Os cards que sobem no hover usam `transform duration-500` sem nenhuma classe `transition`. No v4 o movimento usa a propriedade `translate` em vez de `transform`. O resultado na tela é o mesmo, e não é para "consertar" a falta do `transition` nesta feature.
- O v4 descobre sozinho quais arquivos ler para achar classes, ignorando o que está no `.gitignore`. As pastas `docs/` e `.claude/` têm muito Markdown com nomes de classes.

Já existem classes que não geram estilo nenhum hoje: `border-[#003E53]-300` (quatro campos do `Contact`, um valor inválido), `hover:bg-light-gray` (`BtnWhats`, cor que não existe no tema) e o `bg-opacity-60` do `Hero`. O `backdrop-opacity-10` parece morto, mas não é: ele aplica um filtro de fundo e continua existindo no v4.

O deploy é na Vercel, a partir do git, com `npm run build` e Node 24 (ver `AGENTS.md`). O Tailwind 4 depende de binários nativos por sistema (pacotes opcionais como `@tailwindcss/oxide-linux-x64-gnu`), e o `AGENTS.md` já registra um caso em que dependências opcionais ficaram de fora do `package-lock.json`.

## Requirements

**User stories**:
- Como mantenedor do site, quero o Tailwind na versão atual, para continuar recebendo correções e não acumular um salto maior depois.
- Como visitante, quero que o site continue com a mesma aparência.
- Como visitante no celular, quero que um card não fique "levantado" depois que eu toco nele.

**Acceptance criteria**:
- **AC-1**: o `package.json` declara `tailwindcss` e `@tailwindcss/postcss` em `^4.3.3` nas `devDependencies`, e `postcss` continua lá. O `tailwind.config.ts` não existe mais. O `postcss.config.mjs` usa só o plugin `@tailwindcss/postcss`. O `npm install` termina sem `--legacy-peer-deps`. Um `npm ci` numa cópia limpa do projeto termina sem erro, e o `package-lock.json` tem as entradas de `@tailwindcss/oxide-linux-x64-gnu` e `lightningcss-linux-x64-gnu` (os binários que a Vercel usa). O `npm audit --json` não piora: o conjunto de pares (pacote, alerta e gravidade) novo está contido no da linha de base. Como o banco de alertas muda com o tempo, um par novo só é aceito se o caminho dele (campo `via`) não passar por `tailwindcss`, `@tailwindcss/*`, `lightningcss` nem `postcss`, e cada um aceito assim fica registrado no relatório do `/develop`.
- **AC-2**: o `app/globals.css` começa com `@import "tailwindcss" source(none);` seguido de `@source "../app";` e `@source "../components";`. Não sobra nenhuma diretiva `@tailwind`, nenhum `@config` e nenhuma classe `.cookie-notice`. Existe uma regra em `@layer base` que dá `cursor: pointer` a `button:not(:disabled)` e `[role="button"]:not(:disabled)`. Não existe bloco de compatibilidade para a cor padrão da borda nem para o `ring`, e não existe nenhum `@theme` (os gradientes do config antigo não são levados).
- **AC-3**: `npm run build` (com o lint no `prebuild`) termina com sucesso e gera em `out/` o mesmo conjunto de arquivos da linha de base. A lista de nomes de arquivo é exata, deixando de fora `_next/static/`. Os arquivos vindos de `public/` são iguais byte a byte. Nos HTML, depois de trocar os hashes de `_next/static/` por um marcador, o diff contra a linha de base só pode estar em atributos `class`, e cada mudança bate com o diff dos componentes.
- **AC-4**: as duas páginas geradas ficam visualmente iguais aos prints da linha de base, em 1440 px e 390 px, página inteira, seguindo o *Protocolo de verificação* da spec [0001](0001-nextjs-16-react-19/index.md) (barra de cookies visível, carrosséis no slide inicial, mapa do Google fora da comparação). Isso inclui as caixas brancas translúcidas do `Hero`, do `Brand` e da política de privacidade, e o desfoque do `Apresentation` no desktop. Uma diferença sutil de tom nas cores da paleta padrão (`stone`, `slate`, `gray`) é aceita. Posição, tamanho, espaçamento, forma, opacidade e as cores da marca não podem mudar.
- **AC-5**: no `out/` servido, em 1440 px e sem aceite de cookies salvo: (a) `getComputedStyle` de cada `<button>` da página principal devolve `cursor: pointer`. São os botões de `Hero`, `Contact` (dois), `FormCta`, `BtnWhats` e `CookieNotice`, e a contagem bate com a da linha de base; (b) com um campo do formulário de contato focado, o `box-shadow` calculado contém `rgb(0, 62, 83) 0px 0px 0px 3px` (o texto completo pode diferir da linha de base, porque as variáveis internas do Tailwind mudaram); (c) passar o mouse sobre um card de `CardExperience` ainda o faz subir.
- **AC-6**: o CSS gerado em `out/_next/static/` envolve todas as regras de `hover:` em `@media (hover:hover)` (a busca aceita com ou sem espaço depois dos dois pontos, e uma regra de `:hover` fora desse media é falha). Com `browser_emulate_media` simulando um aparelho sem mouse (`matchMedia('(hover: none)')` verdadeiro), tocar num card não o faz subir. O CSS também não contém nenhuma classe vinda só de `docs/` ou `.claude/` (ex.: um nome de classe que aparece só numa spec). Uma busca no código de `app/` e `components/` não encontra `bg-opacity-`, `border-[#003E53]-300` nem `hover:bg-light-gray`. Em `components/Brand.tsx` e `app/politica-de-privacidade/page.tsx`, o `bg-white bg-opacity-60` virou `bg-white/60`. O `Hero` mantém `bg-white/50`. O `backdrop-opacity-10` continua nos três lugares.
- **AC-7**: o fluxo da barra de cookies continua igual ao AC-6 da spec 0001: sem aceite salvo, a barra aparece e o botão do WhatsApp fica acima dela; ao clicar em Aceitar, a barra some e o botão desce; ao recarregar, a barra não volta. O console não mostra erro novo nas duas páginas, no `out/` servido e no `npm run dev`.
- **AC-8**: o build de preview na Vercel, feito a partir do push da branch `feature/tailwind-4`, termina com sucesso, e a página principal desse preview aparece com os estilos aplicados (a mesma aparência dos prints de 1440 px).

## Options considered

### Option 1: Ferramenta oficial de migração, com revisão

Rodar `npx @tailwindcss/upgrade`, que troca as dependências, reescreve o `postcss.config.mjs`, move a configuração para o CSS e renomeia as classes nos componentes. Depois, revisar o diff e ajustar o que a spec decide diferente.

**Pros**:
- Aplica todos os renomes do guia oficial de uma vez, sem depender de memória.
- O diff gerado é pequeno de revisar num projeto de 27 arquivos.

**Cons**:
- A ferramenta toma decisões sozinha (ex.: pode acrescentar blocos de compatibilidade) que precisam ser revistas.
- Ela pede uma árvore git limpa, e a pasta `.claude/` sem commit atrapalha.

### Option 2: Migração manual

Trocar dependências, configuração e classes à mão, seguindo o guia de upgrade.

**Pros**:
- Controle total de cada linha.

**Cons**:
- Mais trabalho, e um renome esquecido só aparece no print, se aparecer.

### Option 3: Tailwind 4 mantendo o `tailwind.config.ts`

Subir para o v4, mas carregar a configuração em JavaScript com `@config`, sem mover nada para o CSS.

**Pros**:
- Muda menos arquivos.

**Cons**:
- O `@config` existe só para compatibilidade. O arquivo guarda duas definições que ninguém usa, então manter ele é carregar peso morto num formato legado.

### Option 4: Ficar no Tailwind 3.4

Não migrar agora.

**Pros**:
- Nenhum risco visual e nenhum navegador cortado.

**Cons**:
- Continua numa linha sem novidades e com os alertas do `npm audit` da cadeia do v3. Só adia o salto.

## Decision

**Chosen option**: Option 1: Ferramenta oficial de migração, com revisão

O site passa para o Tailwind 4.3 com a configuração no `app/globals.css`, o plugin `@tailwindcss/postcss`, as fontes de classes limitadas a `app/` e `components/`, o cursor de mãozinha mantido nos botões, o anel de foco de 3px mantido, o hover novo do v4 adotado, as classes mortas removidas e as cores da marca ainda como hex nas classes.

## Rationale

O site é pequeno e a configuração quase vazia, então o risco da migração está nas classes, não na configuração. A ferramenta oficial conhece todos os renomes e é mais confiável que uma busca manual. A revisão depois dela garante que nada entra sem passar pelas decisões abaixo. A migração manual é a segunda opção, e vale só se a ferramenta falhar.

O corte de navegadores foi aceito: aparelhos com Safari abaixo de 16.4 são de antes de 2023 e uma fatia pequena do tráfego de hoje, e ficar no v3 por causa deles prende o projeto numa linha que só recebe correções. O comportamento novo do hover também foi aceito, porque no celular o card preso depois do toque é um defeito, não uma escolha de design. A diferença sutil de tom da paleta padrão foi aceita pelo mesmo motivo das cores da marca abaixo: fixar os valores do v3 exigiria um `@theme` só para isso.

As outras mudanças do v4 foram neutralizadas onde mudariam o que o visitante sente. A mãozinha volta por uma regra base, porque os botões são chamadas para agendar e precisam parecer clicáveis. O anel de foco fica em 3px com `focus:ring-3`, porque o foco visível ajuda quem navega pelo teclado. Já a cor padrão da borda não precisa de compatibilidade, porque todo uso de borda declara a cor, e um bloco de compatibilidade sem uso só confundiria quem ler depois.

Limitar as fontes a `app/` e `components/` repete o `content` do v3. Sem isso, o v4 leria as specs e as skills em Markdown e geraria CSS para classes que só aparecem em texto. A alternativa mais simples, `@source not` para `docs/` e `.claude/`, deixaria qualquer pasta nova entrar sem querer.

As cores da marca ficam como hex nas classes para esta feature ser só migração. Tokens no `@theme` mudariam a regra do `AGENTS.md` e todos os componentes, e merecem uma decisão própria.

## Feature design

**Data model sketch**: não se aplica, a mudança não toca dados.

**API surface**: o site é estático e não tem rotas. As interfaces que mudam são estas:

| Interface | Como fica |
|---|---|
| `package.json` | `tailwindcss` e `@tailwindcss/postcss` em `^4.3.3` nas `devDependencies`. `postcss` fica. Scripts sem mudança |
| `postcss.config.mjs` | `plugins: { "@tailwindcss/postcss": {} }` |
| `tailwind.config.ts` | removido |
| `app/globals.css` | `@import "tailwindcss" source(none);`, `@source "../app";`, `@source "../components";` e o `@layer base` com o cursor dos botões. Nada mais |
| `components/Contact.tsx` | `focus:ring` vira `focus:ring-3` (mantém `focus:ring-[#003E53]`). `border-[#003E53]-300` sai dos quatro campos |
| `components/BtnWhats.tsx` | `hover:bg-light-gray` sai |
| `components/Hero.tsx` | `bg-opacity-60` sai, `bg-white/50` fica |
| `components/Brand.tsx`, `app/politica-de-privacidade/page.tsx` | `bg-white bg-opacity-60` vira `bg-white/60` |
| `components/Apresentation.tsx` | `md:backdrop-blur-sm` vira `md:backdrop-blur-xs` (renome obrigatório, mantém os 4px) |
| Demais classes | só os renomes que a ferramenta aplicar, cada um conferido no diff |

**Value sourcing**:
| Action | Value produced / displayed | Source |
|---|---|---|
| `npm install` | versões do Tailwind | `package.json` (AC-1), resolvidas no `package-lock.json` |
| `npm ci` na cópia limpa | binários nativos no lock | entradas `@tailwindcss/oxide-*` e `lightningcss-*` do `package-lock.json`. Cópia limpa numa pasta da sessão, fora do repositório |
| `npm run build` | arquivos lidos para achar classes | `source(none)` e os dois `@source` do `app/globals.css` (AC-2, AC-6) |
| `npm run build` | regras de hover | comportamento padrão do v4, sem `@custom-variant hover` (AC-6) |
| Página | cursor dos botões | regra `@layer base` do `app/globals.css` (AC-5) |
| Página | anel de foco | `focus:ring-3 focus:ring-[#003E53]` no `Contact.tsx` (AC-5) |
| Página | caixas translúcidas | `bg-white/50` (`Hero`) e `bg-white/60` (`Brand`, política) (AC-4, AC-6) |
| `npm audit` | linha de base | `npm audit --json` salvo no passo 1 do Build plan, na pasta temporária da sessão. Para saber se um alerta passa pelo `tailwindcss@3`, usar o campo `nodes`/`via` do próprio JSON |
| Verificação | servidor, URLs, prints e estado fixado | *Protocolo de verificação* da spec 0001: `npx serve out -l 3000`, `http://localhost:3000/` e `/politica-de-privacidade`, Playwright MCP com `browser_take_screenshot` de página inteira |
| Verificação AC-5 | estilos calculados | `browser_evaluate` no Playwright MCP com `getComputedStyle`, na linha de base e depois. O foco usa `element.focus()` num campo do `Contact` |
| Verificação AC-6 | regras de hover e classes vindas de `docs/` | busca de texto nos `.css` de `out/_next/static/`. A classe de teste é escolhida no passo 1, pegando um nome de classe válido do Tailwind que aparece numa spec e em nenhum arquivo de `app/` ou `components/` |
| Verificação AC-6 (toque) | aparelho sem mouse | `browser_emulate_media` do Playwright MCP, conferido com `matchMedia('(hover: none)')` antes do toque |
| Commit | o que entra e quem faz | o agente do `/develop` faz o commit na `feature/tailwind-4` com código, `package.json`, `package-lock.json`, spec e scope. `.claude/` e `skills-lock.json` ficam fora |
| Preview na Vercel | branch, push e log | branch `feature/tailwind-4`. O push é feito por você, ou pelo agente depois de pedir sua permissão. Team e projeto (`landing-camila`) vêm de `list_teams` e `list_projects` do Vercel MCP, nunca chutados. Estado e log do build vêm de `list_deployments` e `get_deployment` |
| Preview na Vercel | a página com estilo | o preview tem proteção de acesso, então o acesso vem de `get_access_to_vercel_url` (link com liberação) aberto no Playwright MCP para o print de 1440 px, ou de `web_fetch_vercel_url` para conferir que o CSS carrega |
| Comparação do `out/` | lista de referência | lista do `out/` salva no passo 1 do Build plan, sem `_next/static/` |

**Key invariants**:
- `output: "export"` e `images.unoptimized: true` continuam em `next.config.mjs`.
- As cores da marca continuam como hex fixos nas classes. Nada de `@theme` nesta feature.
- Nenhum bloco de compatibilidade do v3 fica no CSS, exceto a regra do cursor dos botões.
- Nenhuma mudança de comportamento em JavaScript. Os componentes só mudam em `className`.
- Nada de `--legacy-peer-deps`, `.npmrc` ou `overrides`.
- O commit leva o código, o `package.json`, o `package-lock.json`, a spec e o scope. A pasta `.claude/` e o `skills-lock.json` ficam fora.

**Security model**: sem mudança de acesso. Sair do Tailwind 3 tira do projeto os alertas do `npm audit` que vinham da cadeia dele (AC-1).

**Configuration required**: nenhuma variável de ambiente nova. Nenhuma mudança nas configurações do projeto na Vercel (o Node 24 já atende o Tailwind 4).

**Critical test scenarios**:
- Caminho feliz: `npm install`, `npm run build` verde e `out/` com o mesmo conjunto de arquivos, verifica **AC-1**, **AC-2**, **AC-3**
- Visual: prints de página inteira nas duas páginas e nas duas larguras batem com a linha de base, verifica **AC-4**
- Diferenças do v4 neutralizadas: cursor, anel de foco e hover no desktop, verifica **AC-5**
- Mudanças aceitas e limpeza: hover dentro de `@media (hover: hover)`, CSS sem classes de `docs/`, classes mortas fora, verifica **AC-6**
- Barra de cookies e console, verifica **AC-7**
- Falha de instalação: `npm ci` na cópia limpa e o preview na Vercel com os binários nativos de Linux, verifica **AC-1**, **AC-8**

## Build plan

Abordagem Tracer Bullet (do cabeçalho do scope): primeiro o Tailwind 4 roda de ponta a ponta com o build passando, depois o resultado é ajustado às decisões desta spec, e por fim a verificação real, local e na Vercel.

1. [x] Linha de base no `main`, guardada na pasta temporária da sessão: `npm audit --json`, `npm run build`, lista do `out/`, cópia do CSS gerado, e, seguindo o *Protocolo de verificação* da spec 0001, os prints das duas páginas em 1440 px e 390 px, o console (no `out/` servido e no `npm run dev`) e os estilos calculados do AC-5 (cursor dos botões e `box-shadow` do campo focado). Escolher também a classe de teste do AC-6, satisfies **AC-1**, **AC-3**, **AC-4**, **AC-5**
2. [x] Ponta a ponta no v4: criar a branch `feature/tailwind-4`, rodar `npx @tailwindcss/upgrade` (se ele recusar por causa da `.claude/` sem commit, usar `--force`, já que a pasta não entra no commit), conferir com `git status` e `git diff --stat` que só mudaram `package.json`, `package-lock.json`, `postcss.config.mjs`, `app/globals.css`, `tailwind.config.ts` (removido) e arquivos `.tsx` de `app/` e `components/` (qualquer outro arquivo tocado é revertido), que o `postcss.config.mjs` usa `@tailwindcss/postcss` e que as versões ficaram em `^4.3.3` (se não, `npm install -D tailwindcss@^4.3.3 @tailwindcss/postcss@^4.3.3`). `npm run build` passando, satisfies **AC-1**, **AC-3**
3. [x] Ajustar à spec, revisando o diff da ferramenta arquivo por arquivo: escrever o `app/globals.css` como na tabela (fontes limitadas, regra do cursor, sem `.cookie-notice`, sem blocos de compatibilidade), conferir `focus:ring-3` no `Contact`, remover as classes mortas, garantir `bg-white/60` no `Brand` e na política e `bg-white/50` no `Hero`. Desfazer qualquer outra mudança da ferramenta que não seja um renome obrigatório. Lint e build verdes, satisfies **AC-2**, **AC-5**, **AC-6**
4. [x] Conferir o lock: `npm ci` numa cópia limpa do projeto, entradas dos binários de Linux no `package-lock.json` e `npm audit --json` comparado com a linha de base. Se faltarem os binários de Linux, apagar `node_modules` e `package-lock.json`, rodar `npm install` de novo e conferir outra vez. O `npm ci` num Mac não pega essa falta, então a conferência das entradas no lock é obrigatória, satisfies **AC-1**
5. [x] Verificar no app real: servir o `out/` novo, tirar os mesmos prints e comparar, conferir os estilos calculados, o hover no desktop e no aparelho sem mouse simulado, o CSS gerado, o diff dos HTML, a barra de cookies e o console no `out/` e no `npm run dev`, satisfies **AC-3**, **AC-4**, **AC-5**, **AC-6**, **AC-7**
6. [ ] Commitar na `feature/tailwind-4` (ver *Value sourcing*) e, com sua permissão para o push, validar o preview da branch na Vercel pelo Vercel MCP, satisfies **AC-8**

## Consequences

**Positive**:
- Tailwind numa versão atual, com o build de CSS mais rápido do motor novo.
- Uma configuração a menos na raiz: tudo do estilo fica no `app/globals.css`.
- Sai a cadeia de dependências do Tailwind 3 e os alertas do `npm audit` que vinham dela.
- No celular, os cards não ficam mais presos no estado de hover depois do toque.
- O código perde classes que não faziam nada e confundiam a leitura.

**Negative / tradeoffs**:
- Visitantes com Safari abaixo de 16.4, Chrome abaixo de 111 ou Firefox abaixo de 128 veem o site sem os estilos aplicados direito. Não há fallback.
- No celular, quem tocava num card via ele subir. Esse retorno visual some.
- Os tons das cores da paleta padrão (`stone`, `slate`, `gray`) mudam de leve, porque o v4 os define em oklch. Foi aceito para não criar um `@theme` só para copiar os valores do v3.
- A regra do cursor é um pedaço de comportamento do v3 mantido à mão. Quem ler o CSS precisa saber por que ela existe.
- O `package-lock.json` passa a depender de binários nativos por sistema, e um lock gerado sem as dependências opcionais quebra o build na Vercel. O passo 4 confere isso, mas o risco volta a cada mudança de dependência.

**Neutral**:
- Desfazer é reverter um commit: a migração não toca dados e sai inteira num único deploy.
- O `AGENTS.md` ainda diz Tailwind CSS 3 na Stack. O `/sync` atualiza depois.

## Follow-up

- [ ] Opcional: decidir se as cores da marca viram tokens no `@theme` (ex.: `bg-marca-azul`), numa spec própria. Isso muda a regra de estilo do `AGENTS.md`.
- [ ] O `AGENTS.md` precisa trocar Tailwind CSS 3 por 4 na Stack e mencionar que a configuração do Tailwind fica no `app/globals.css` (o `/sync` faz isso depois do merge).
