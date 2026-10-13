# 0003. Migrar para o Tailwind CSS 4: decisão

Registro da decisão da spec [0003](index.md). O `/develop` não lê este arquivo.

## Context

O projeto usa o Tailwind 3.4, que só recebe correções. Parte dos alertas do `npm audit` registrados na spec [0002](../0002-lint-eslint-flat-config.md) vem da cadeia de dependências do Tailwind 3. A configuração atual é mínima: o `tailwind.config.ts` lista as pastas `app/` e `components/` e define duas imagens de fundo (`gradient-radial` e `gradient-conic`) que nenhum componente usa. O `postcss.config.mjs` só chama o plugin `tailwindcss`, e o `globals.css` tem as três diretivas `@tailwind` mais uma classe `.cookie-notice` que nenhum componente usa.

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

## Rationale

O site é pequeno e a configuração quase vazia, então o risco da migração está nas classes, não na configuração. A ferramenta oficial conhece todos os renomes e é mais confiável que uma busca manual. A revisão depois dela garante que nada entra sem passar pelas decisões abaixo. A migração manual é a segunda opção, e vale só se a ferramenta falhar.

O corte de navegadores foi aceito: aparelhos com Safari abaixo de 16.4 são de antes de 2023 e uma fatia pequena do tráfego de hoje, e ficar no v3 por causa deles prende o projeto numa linha que só recebe correções. O comportamento novo do hover também foi aceito, porque no celular o card preso depois do toque é um defeito, não uma escolha de design. A diferença sutil de tom da paleta padrão foi aceita pelo mesmo motivo das cores da marca abaixo: fixar os valores do v3 exigiria um `@theme` só para isso.

As outras mudanças do v4 foram neutralizadas onde mudariam o que o visitante sente. A mãozinha volta por uma regra base, porque os botões são chamadas para agendar e precisam parecer clicáveis. O anel de foco fica em 3px com `focus:ring-3`, porque o foco visível ajuda quem navega pelo teclado. Já a cor padrão da borda não precisa de compatibilidade, porque todo uso de borda declara a cor, e um bloco de compatibilidade sem uso só confundiria quem ler depois.

Limitar as fontes a `app/` e `components/` repete o `content` do v3. Sem isso, o v4 leria as specs e as skills em Markdown e geraria CSS para classes que só aparecem em texto. A alternativa mais simples, `@source not` para `docs/` e `.claude/`, deixaria qualquer pasta nova entrar sem querer.

As cores da marca ficam como hex nas classes para esta feature ser só migração. Tokens no `@theme` mudariam a regra do `AGENTS.md` e todos os componentes, e merecem uma decisão própria.
