---
title: O jeito mais simples de entender identity functors
date: "2020-07-14"
description: O jeito mais fácil de entender functors na minha humilde opinião é o conceito...
languageKey: pt_br
languageLink: /en/the-easier-way-to-understand-functors
---

Eu realmente gosto de linguagens funcionais, e eu tenho estudado algumas nos últimos anos como Elm e agora Reason apenas por diversão. Nunca fiz nada sério com essas linguagens como um App em produção em alguma empresa que trabalhei, mas eu gosto de trazer conceitos dessas linguagens para o Javascript. Meu problema é que de alguma forma eu sempre acabo frustrado quando estou estudando alguns dos conceitos de programação funcional,

como functors.

<h2 class="subtitle--separator">Mais oque realmente são functors?</h2>


O jeito mais fácil de entender functors na minha humilde opinião é o conceito: 

- Functors são funçōes que retornam o valor passado de uma maneira que você consegue mapea-lo quantas vezes precisar até chegar no resultado desejado. Dessa forma, isso vai te ajudar a vizualizar melhor o fluxo de transformação do dado ao invéz de ficar criando várias variáveis na mémoria para salvar os estados intermediários da transformação que não são úteis no resultado final. Lembra do método `promise.then` que conseguimos encadear várias chamadas `.then` tratando cada passo na transformação dos dados.

`talk is cheap, show me the code.`


Qualquer tipo de valor pode ser mapeavel com functors como podemos ver no exemplo abaixo onde money é uma string:

```js
function convertMoneyToNumber(money) {
  return functor(money)
    .map(money => money.replace(/\$/, ''))
	.map(parseFloat) //same as .map(money => parseFloat(money))
    .value;
}
```

Considerando que temos uma função como essa:

```js
function convertMoneyToNumber(money) {
  const moneyWithoutMask = money.replace(/\$/, '');

  return parseFloat(moneyWithoutMask)
}
```

Vamos criar um helper chamado functor, essa função aceita qualquer tipo de valor e retorna esse valor mapeável como arrays, então agora conseguimos encadear chamadas .map transformando qualquer valor no valor desejado.

```js
const functor = (anyValue) => ({
  map: f => functor(f(anyValue)),
  value: anyValue
})
```

Como podemos ver, a função functor recebe `qualquer valor` e retorna um objeto com:

  - Um método chamado `map` que recebe a função e retorna um functor do valor que a função passada retornou, fazendo com que o valor retornado seja mapeável novamente.
  
  - Um campo chamado `value` que contém o resultado da ultima função executada, pesquisando você vai achar variações dessa ideia como o método `flatMap` que retorna o valor da função executada sem encapsular o mesmo em um functor, então na última chamada da pilha de maps ao invés de chamar `map(anyValue).value` você vai chamar apenas `flatMap(anyValue)`

Agora com o nosso functor helper, podemos converter a função convertMoneyToNumber para:


```js
function convertMoneyToNumber(money) {
  return functor(money)
    .map(money => money.replace(/\$/, ''))
	.map(parseFloat) //same as .map(money => parseFloat(money))
    .value;
}
```

Agora nós podemos mapear qualquer tipo de valor transformando seu valor original em um novo valor, não apenas arrays! E só para deixarmos claro essa é só a base da ideia de functors, temos muitas outras variantes e formas de compor functors.

Eu espero que você tenha aprendido algo novo hoje! 