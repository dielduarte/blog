---
title: Introdução a state charts em aplicações web
date: "2020-11-01"
description: Era uma vez um Front-end que não conhecia State Chartse e tinha uma tarefa muito "simples"...
languageKey: pt_br
languageLink: /en/web-development-with-state-charts-intro
socialImage: /blog/images/web-development-with-state-charts-intro/image-7.png
---

Era uma vez um Front-end que não conhecia State Charts e tinha uma tarefa muito "simples", construir um componente de input. O  "simples" input para edição de um nome tinha algumas variações de estados:

`inicial`: O input aparece desabilitado, o usuário pode então clicar no ícone de editar. 

`editando`: O input está habilitado para receber o novo valor de nome, o usuário pode então clicar no ícone de salvar.

`salvando`: No lugar dos ícones de editar/salvar mostramos um loading sinalizando que alguma ação assíncrona está acontecendo, nesse caso, estamos salvando o novo valor de nome.

![imagem mostrando o component de input e seus estados.](/blog/images/web-development-with-state-charts-intro/image-1.jpeg) 

<h2 class="subtitle--separator"></h2>

Nosso querido Front-end começou a implementação com duas variáveis boleanas:

```js
isEditing = false
isSaving = false
```

E uma função de ***onClick*** que recebia por parametro os valores de `isEditing` e `isSaving`.  Seu pensamento foi: A primeira vez que a função de onClick for chamada, estamos no estado inicial, logo preciso enviar o usuário para o estado de ***editando***:

```js
function onClick(isEditing, isSaving) {
  if(!isEditing && !isSaving) {
    isEditing = true;
  }
}
```

![imagem mostrando o component de input em seu estado inicial e mostrando que o ícone editar possui um evento de on click.](/blog/images/web-development-with-state-charts-intro/image-2.jpeg) 

Ao chegar no estado de edição e sabendo que o usuário poderia novamente clicar no ícone que dessa vez se transformava no ícone para salvar, o mesmo continuou sua implementação adicionando mais um trecho código na função de ***onClick***:

```js
function onClick(isEditing, isSaving) {
  if(!isEditing && !isSaving) {
    isEditing = true;
  }

  if(isEditing) {
    isEditing = false;
    isSaving = true;

    saveName()
     .then(() => {
       isSaving = false;
       isEditing = false;
     })
  }
}
```

O trecho de código adicionado primeiro testa se o usuário está no estado de ***edição***, caso verdadeiro, faz o switch das variáveis para levar o usuário para o estado de ***salvando***, e logo em seguida faz um request na api para salvar o novo valor de nome. Ao receber um retorno da api, resetamos as duas variáveis boleanas para false, pois agora, o usuário não está editando e nem salvando um novo valor, o que supostamente levaria o usuário para o estado ***inicial***.

![imagem mostrando o component de input saindo do esado de editando para salvando, e depois de salvando para inicial.](/blog/images/web-development-with-state-charts-intro/image-3.png)

Não muito confiante na solução, deu a task como terminada e seguiu sua vida.

![gif de um menino nerd dando joinha.](/blog/images/web-development-with-state-charts-intro/gif-1.gif)

<h2 class="subtitle--separator"></h2>

...Era uma vez um designer, que esqueceu de trabalhar no estado de erro do "simples" componente de input.

***“Hey dev, Esqueci de um detalhe, não tratamos o estado de erro do input. Quando der erro, volta pro estado de edição por que o cliente pode tentar salvar novamente.”***

Mesmo sabendo que a solução atual não era a ideal, continuou com a mesma implementação para adicionar o estado de erro, agora, ao invés de 2 variáveis boleanas, seriam três:

```js
isEditing = false
isSaving = false
isError = false
```

Essa pequena adição resultou na função de onClick abaixo:

```js
function onClick(isEditing, isSaving, isError) {
  if(!isEditing && !isSaving) {
    isEditing = true;
  }

  if(isEditing) {
    isEditing = false;
    isSaving = true;
    isError = false;

    saveName()
     .then(() => {
       isSaving = false;
       isEditing = false;
     })
     .catch(() => {
       isError = true;
       isSaving = false;
       isEditing = false;
     })
  }
}
```

Task concluida novamente. 
Desconfortável com a solução final, foi pesquisar. Afinal, qual o problema com variáveis boleanas? 

![imagem mostrando que podemos ter 8 variações usando 3 variáveis booleanas.](/blog/images/web-development-with-state-charts-intro/image-4.png)

O problema é que como na imagem acima, apesar de parecer inofensiva e óbvio, 1 variável boleana representa duas variações. O porém que ninguém lembra é que adicionando mais de uma variável, suas variações crescem exponencialmente. Com três variáveis boleanas como no exemplo acima, temos 8 variações.

E aí, você acha que o código acima está preparado para lidar com 8 variações? A resposta infelizmente é: não. Seu código pode parecer simples e estar 99% vunerável a bugs.

![meme de um homem tampando a placa do carro pela metada na primeira parte da foto, e na segunda parte tampando a outra.](/blog/images/web-development-with-state-charts-intro/image-5.jpg)

Sabendo disso, podemos fazer diferente, podemos mapear todos os estados em uma constante:

```js
const stateType = {
  'IDLE': 'IDLE',
  'EDITING': 'EDITING',
  'SAVING': 'SAVING',
  'ERROR': 'ERROR'
};
```

Podemos também criar um objeto que nos diga qual o estado atual e qual o próximo estado, exemplo:

```js
 const nextState = {
   [stateType.IDLE]: stateType.EDITING,
   [stateType.EDITING]: stateType.SAVING,
   [stateType.SAVING]: {
     success: stateType.IDLE,
     error: stateType.ERROR
   },
   [stateType.ERROR]: stateType.SAVING
 }
```

Limitaremos então o estado do input para apenas UM estado por vez:

```js
inputState = stateType.IDLE
```

E nossa função de onClick receberia apenas o nosso estado atual por parâmetro, e usando o objecto nextState, saberiamos qual o próximo estado deveríamos mover nosso componente. Exemplo:

```js
function onClick(currentInputState) {
  if(currentInputState === stateType.EDITING) {
     saveName()
     .then(() => currentInputState === nextState[stateType.saving].success)
     .catch(() => currentInputState === nextState[stateType.saving].error)
  } else {
	  currentInputState = nextState[currentInputState];  
  }
}
```

Podemos resumir nossa história em problema e solução:

`Problema:`

Manter o estado usando variáveis condicionais ficou confuso, além de obrigar a tratar todos os edge cases e rezar para que o estado não caísse em possíveis combinações que não foram tratadas.

`Solução:`

Ter um único estado por vez e definir as transições entre estados através de um evento.

<h2 class="subtitle--separator"></h2>

Nossa solução tem um nome: `Finite State Machines`, mas a final oq é Finite State Machines? 

> Uma Máquina de estados finita (Finite State Machines ou FSM) é um modelo matemático usado para representar programas de computadores ou circuitos lógicos. O conceito é concebido como uma máquina abstrata que deve estar em **UM** de um número finito de estados.

source: [https://pt.wikipedia.org/wiki/Máquina_de_estados_finita](https://pt.wikipedia.org/wiki/M%C3%A1quina_de_estados_finita)

Uma forma bem simples de representar FSM é usando um diagrama de transição de estados, onde o conseguimos vizualizar todo o fluxo de transição de estados por exemplo:

***começando em um estado A ⇒ um vento X aconteceu ⇒ vamos para um estado B***

![imagem mostrando um diagrama de transição de estados](/blog/images/web-development-with-state-charts-intro/image-6.png)

### Finite State Machines? State charts? que confusão!

Quando começamos a estudar mais sobre Finete State Machines vamos sempre nos deparar com um outro nome que é `State Charts`, mas a propósito qual a grande diferença entre eles? 

Como qualquer solução, Finite State Machines por sí só tem alguns problemas, geralmente acabam com um grande número de estados, muitos deles com transições idênticas, tornando muito verboso e de difícil manutenção. Este é o famoso problema conhecido como explosão de estados.

State Charts por sua vez, apareceu pouco tempo depois adicionando soluções para que FSM fossem mais escalável a medida que o seu sistema fosse crescendo e ficando mais complexo. Além de novas ideias para tornar sua vida mais fácil.

![imagem mostrando alguns dos conceitos que state charts contém, como activity, actions, paralel states entre outros...](/blog/images/web-development-with-state-charts-intro/image-7.png)

Vale lembrar que a ideia foi apresentada há mais de 20 anos atrás, além de ser uma das bases da computação, é usada largamente em hardware embarcados e games! Com o aparecimento da lib Xstate que vamos descobrir no próximo post, o uso na web e pricipalmente usando Javascript está crescendo cada vez mais. Apenas para deixar um gostinho do que vamos ver no próximo artigo e também sobre uma das maiores vantagens de se usar State Charts que é o poder de vizualizar seu código, dá uma olhada como ficaria nosso codigo do componente de input usando Xstate:

[https://xstate.js.org/viz/?gist=d73e129d583ac4a0ba956736e68dbdd2](https://xstate.js.org/viz/?gist=d73e129d583ac4a0ba956736e68dbdd2)

Não se preocupe se não entendeu o código, vamos aprender tudo sobre o uso de Xstate e State Charts em uma aplicação real no próximo artigo!


### Estado? É tipo redux?

Quando trabalhamos com State Charts, os famosos estados não são os estados dinâmicos ou relacionados a dados de uma aplicação e sim em qual cenário de uma possibilidade finita e pré estabelecida uma aplicação está, lembre-se da regra de ouro, uma aplicação pode estar em UM único estado por vez. Exemplo:

Sua aplicação pode estar no estado de loading e ter um contexto `user=null`, em uma próximo momento sua aplicação estaria em um estado de logado e ter um contexto `user={ id: 1, name:  'Diel' }`. Com esse exemplo fica fácil assimilar que o estado como estamos acostumados no Redux ou outras opções são chamados de contexto no mundo dos statecharts.

Te vejo no próximo post, onde vamos aprender a como modelar uma aplicação utilizando State Charts e Xstate.