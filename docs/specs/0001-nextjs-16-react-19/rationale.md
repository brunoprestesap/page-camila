# 0001. Atualizar para Next.js 16 e React 19 (decision record)

## Context

O site é uma landing page estática (`output: "export"`), com 19 componentes, duas páginas e quatro componentes de cliente (`CookieNotice`, `MetaPixel`, `Depositions`, `ContentsVideo`). A fatia 1 já levou cada dependência à última versão dentro da major atual (Next 14.2.35, React 18). As versões atuais são Next 16.4.0, React 19.3.0, `@next/third-parties` 16.4.0 e `@types/react` 19.3.0.

O Next 16 traz mudanças que tocam este projeto: o comando `next lint` deixa de existir (e o `next build` para de rodar o lint), o Turbopack vira o empacotador padrão no `dev` e no `build`, o Node mínimo passa a ser 20.9, e os padrões do `next/image` mudam (cache, qualidades, tamanhos). O `eslint-config-next@16` exige o ESLint 9 no formato novo de configuração (flat config). Já o React 19 muda os tipos (`@types/react@19` remove o namespace global `JSX` e exige argumento no `useRef`) e o comportamento de hidratação (a etapa em que o React conecta o HTML pronto ao JavaScript).

O código não usa nenhuma das APIs que o Next 15 e o 16 tornaram assíncronas ou renomearam: não há `middleware`, `cookies()`, `headers()`, `params` de rota dinâmica nem configuração de webpack. As imagens usam `unoptimized: true`, então os novos padrões do `next/image` não se aplicam. O que pode quebrar está no build com o Turbopack, nos tipos do React 19 e nos scripts de terceiros (GTM pelo `@next/third-parties` e Meta Pixel pelo `next/script`).

O site é gerado na máquina do engenheiro (Node 24) e a pasta `out/` é enviada para a hospedagem, então nenhum servidor de build precisa ser atualizado. O risco que importa é de regressão silenciosa: uma seção que muda de layout, o GTM que para de carregar ou o evento de clique no WhatsApp que deixa de ser enviado. Qualquer um desses afeta direto o agendamento de pacientes e a medição das campanhas.

## Options considered

### Option 1: Salto direto para o Next 16 e React 19, atualização manual

Instalar as versões atuais de uma vez, deixar o `next build` ajustar sozinho o `tsconfig.json` e o `next-env.d.ts`, e corrigir o que o build apontar. Um commit, uma verificação.

**Pros**:
- O código é pequeno e não usa nenhuma API que mudou entre o 14 e o 16, então o salto é curto na prática.
- O diff mostra exatamente o que mudou, sem reescritas automáticas.
- Uma única rodada de verificação visual cobre tudo.

**Cons**:
- Se algo quebrar, a causa pode estar no Next 15 ou no 16, no React 19 ou no Turbopack, e você precisa isolar.
- Exige ler os dois guias de migração (15 e 16) em vez de seguir um codemod.

### Option 2: Dois passos, primeiro Next 15 e depois Next 16

Subir para o Next 15 com React 19, verificar e fazer commit; depois subir para o 16 e verificar de novo.

**Pros**:
- Isola os problemas do React 19 dos problemas do Next 16 e do Turbopack.
- Cada passo deixa o site no ar, bem no espírito do Tracer Bullet.

**Cons**:
- Dobra o trabalho de verificação visual para um código que não usa nenhuma API afetada pelo 15.
- O Next 15 é uma versão intermediária que o site nunca vai usar em produção.

### Option 3: Codemod oficial (`npx @next/codemod upgrade latest`)

Deixar a ferramenta oficial atualizar as dependências e reescrever o código onde ela achar necessário.

**Pros**:
- Automatiza as mudanças conhecidas e reduz a chance de esquecer alguma.
- É o caminho que a documentação oficial sugere.

**Cons**:
- Pode reescrever arquivos e configurações que não precisavam mudar e misturar isso no diff.
- Não resolve a questão do lint nem a verificação, que são o trabalho real aqui.

## Rationale

O que decide aqui é o tamanho real do salto, não o número da versão. O código não usa nenhuma das APIs que o Next 15 tornou assíncronas, nem `middleware`, nem webpack próprio, e as imagens não passam pela otimização. Então o passo pelo Next 15 (Option 2) custaria uma rodada inteira de verificação visual para isolar problemas que esse código não tem. Se o build do 16 quebrar, o diagnóstico continua barato: rodar `next build --webpack` uma vez separa um problema do Turbopack de um problema do Next ou do React.

O codemod (Option 3) resolve o que este projeto não precisa e deixa de lado o que precisa. A parte com risco é o lint, os scripts de terceiros e a prova visual, e o codemod não toca em nenhuma delas. A atualização manual deixa um diff pequeno e legível, que é o que importa num site em que o risco é de regressão silenciosa.

Sobre as escolhas menores: o Turbopack é aceito porque já é o padrão e não há configuração de webpack para portar (o runner up, `--webpack`, só adiaria uma migração que a ferramenta vai forçar). O React Compiler fica desligado porque quatro componentes de cliente simples não ganham nada visível com memorização automática, e ligá-lo põe o babel no build e mais uma variável no mesmo salto. A ponte do lint usa `eslint app components --max-warnings 0` em vez de `eslint .` porque são as mesmas pastas que o `next lint` olhava e evita varrer `.next/` e `out/` sem precisar de um arquivo de ignore novo. O runner up seria `eslint . --ignore-path .gitignore`, que funciona, mas muda o escopo do lint sem motivo. O `--max-warnings 0` existe porque, sem o `next build` rodando o lint, avisos ignorados passariam sem ninguém ver. O `eslint-config-next@14` aceita ESLint 8 e não depende da versão do `next`, então a ponte é segura até a feature 4.

