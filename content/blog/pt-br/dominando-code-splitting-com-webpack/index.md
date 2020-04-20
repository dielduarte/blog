---
title: Dominando code splitting com webpack
date: "2019-07-17"
description: Vamos conversar sobre como Webpack pode ajudar no processo de code splitting para atingir a meta de um site mais performático.
languageKey: pt_br
languageLink: en/mastering-code-splitting-with-webpack
---

Code Splitting é um processo em build time que quebra parte do seu código em pequenos pedaços que são requisitados de forma assíncrona, apenas quando necessário. Vamos conversar sobre como Webpack pode ajudar no processo de Code Splitting para atingir a meta de um site mais performático.

<h2 class="subtitle--separator">Mas primeiro, como saber quando eu tenho que quebrar o meu código em pequenos pedaços (chunks)?</h2>

Os processos mais caros quando falamos sobre renderizar um Website são os processos de download e parsing do Javascript e CSS. Sabendo desse fato, se nós não precisamos de uma parte específica do código no primeiro render, esse código é um ótimo candidato para ser quebrado em uma outra parte e ser baixado sobre demanda. 

O Google Chrome tem uma ótima ferramenta chamada `coverage` que nos mostra qual porcentagem do código baixado está ou não está sendo usado. Isso pode ser usado como uma métrica para seguir e saber o quanto do código baixado poderia ser quebrado em partes assíncronas.

Para usar essa ferramenta abra o dev tools do Chrome, `cmd/ctrl + p`, e digite `show coverage`:

![imagem mostrando como acessar a janela coverage no dev tools do Chrome](/blog/images/coverage.png) 

Uma vez que abrimos a opção coverage, clique no botão de reload e espere até que nosso site seja completamente carregado. Os resultados vão nos motrar o quanto do código carregado por arquivo está sendo usado. É maravilhoso! &#128525;

![imagem mostrando a tab coverage, onde nos podemos ver a lista de arquivos baixados e o quanto do código de cada arquivo está sendo usado.](/blog/images/result.png) 

No exemplo abaixo, 46% do código entregue `não` está sendo usado, essa métrica também é relativa, dependende do tamanho do arquivo e de muitas outras variáveis. Então é sempre bom entender o contexto que estamos trabalhando quando estivermos usando essas ferramentas.

## Code splitting e webpack

Com Webpack nos temos duas formas de trabalhar com Code Splitting, imports estáticos e dinâmicos. As duas formas usam [dynamic imports, uma feature do es2020](https://v8.dev/features/dynamic-import)

### Imports estáticos

- É bom para ser usado quanto estivermos importando bibliotecas/módulos de Javascript pesados.
- Qualquer parte do código que chamamos de temporal, ou seja, coisas que não são vísiveis todo o tempo na sua página, exemplos: tooltips, modais/alertas.
- Rotas.

Para usar imports estáticos no seu código, é muito simples: 

```js
import('path/to/myModule.js')
  .then((module) => {...})
```

Ou ainda melhor, criando uma função que importa o módulo quando necessário. O import do arquivo é feito apenas uma vez, depois da primeira é cacheado e na próxima vez que usar a função o módulo é retornado instantaneamente, exemplo:

```js
const getModule = () ⇒ import('path/to/myModule.js')

getModule()
  .then(module => {...})
```

### Imports Dinamicos

Imports dinâmicos não são de verdade dinâmicos, porque eles acontecem em build time. Ao usar imports dinâmicos estamos dizendo para o Webpack: Ei Webpack, por favor, crie todos os chunks possíveis para o caminho que eu estou te passando, seja uma pasta, ou várias em build time. Dessa forma nos conseguimos usar variáveis o que torna esse processo de import "dinâmico".

Vamos considerar que nós temos uma pasta de temas, ex:

```js
themes
  └── dark.js
  └── light.js
```

Como exemplo nós poderiamos importar os temas assim:

```js
const getTheme = (theme) ⇒ import(`path/to/themes/${theme}`)

getTheme('dark')
  .then(theme => {...})
```

Dessa forma o Webpack vai criar todos os possíveis chunks em build time para cada tema dentro da pasta `themes`, essa técnica é chamada de `ContextModule` dentro do código do Webpack.

## Comentários Mágicos

### webpackChunkName

```js
import(/* webpackChunkName: "my-chunk-name" */ 'path/to/myModule.js')
```
Por default o Webpack cria os nomes dos chunks seguindo uma ordem numérica, 1.js, 2.js, 3.js, o que torna o processo de reconhecer quais arquivos foram importados difícil. Usando `webpackChunkName` nós podemos renomear o chunk, é importante lembrar que para esse comentário mágico funcionar nós devemos estar usando `output.chunkFileName: [name].whateverDoYouWantHere.js` no arquivo de configuração do Webpack.

Isso é útil apenas no modo de desenvolvimento, então podemos fazer algo do tipo ao importar o arquivo:

```js
if(process.NODE_ENV === 'development') {
  import(/* webpackChunkName: "my-chunk-name" */ 'path/to/myModule.js')
} else {
  import('path/to/myModule.js')
}

```

O `if` vai ser removido se o build estiver sendo rodado em modo de produção, e o `else` se estiver rodando em modo de desenvolvimento. Isso é conhecido como `dead-code elimination` ou em pt-br eliminação do código morto, ferramentas como Uglify.js e outras usam isso para reduzir o tamanho do arquivo final.

### webpackMode

```js
import(/* webpackMode: "lazy" */ `path/to/themes/${theme}`)
```

O comentário mágico `webpackMode` pode receber 4 tipos de valores:

- lazy: gera um chunk para cada arquivo importado dinamicamente, melhor opção para ser usado em produção.
- lazy-once: gera um chunk apenas que pode satisfazer a condição do import dinâmico, melhor opção para o modo de desenvolvimento reduzindo o tempo de de gerar os arquivos finais do Webpack.
- eager: não gera nenhum chunk extra, todos os módulos são gerados em apenas um arquivo e nenhum request extra é feito.
- weak: útil para universal rendering / ou server side rendering, onde os arquivos são servidos manualmente no primeiro render. O que acontece é que ao requisitar um módulo uma promisse é sempre retornada, mas essa promisse só retorna com sucesso se requisitada pelo client side. Um novo request nunca é feito, pois os arquivos já estão no client pois foram servidos pelo servidor.

### Prefetch e Preload

```js
import(/* webpackPrefetch: true */ `path/to/themes/${theme}`)

import(/* webpackLoad: true */ `path/to/themes/${theme}`)
```

Os dois comentários mágicos, irão criar uma tag link com `rel=prefetch` ou `rel=preload` automaticamente para você fazer o prefetching ou preloading dos seus chunks dependendo da implementação. Se você não sabe o que prefetch e preload links fazem, eu recomendo
a leitura do post [Preload, Prefetch And Priorities in Chrome](https://medium.com/reloading/preload-prefetch-and-priorities-in-chrome-776165961bbf).

Essas foram minhas anotações do curso [Web performance with webpack](https://frontendmasters.com/courses/performance-webpack/). Espero que você tenha aprendido alguma coisa nova hoje, te vejo no próximo post! ❤️