---
title: Rescript sob o ponto de vista de um dev JS
date: "2021-04-27"
description: Algumas opiniões sobre a linguagem Rescript.
languageKey: en
languageLink: /en/rescript-from-a-js-dev-point-of-view
socialImage: /blog/images/rescript-from-a-js-dev-point-of-view/image-1.png
---

Vocês sabem que eu gosto muito de estudar sobre novas linguagens, gosto de estudar sobre compiladores e mais. As duas últimas linguagens que venho estudando são go (obrigado [Guilherme](https://github.com/guilhermehubner) por me influenciar a usar Go em um projeto paralelo que fazemos juntos, um dos melhores engenheiros que conheço 💜) e Rescript. Vocês também sabem que ganho dinheiro como desenvolvedor Javascript/front-end e eu amo isso, mesmo com todos os problemas que temos em Javascript continua uma ótima linguagem, flexível e fácil para um iniciante usar e para um desenvolvedor avançado continuar usando e gostando. A linguagem também é flexível o suficiente para rodar em qualquer lugar, Web, Desktop, Mobile, Hardware, você escolhe! A comunidade é muito ativa, nesse momento provavelmente temos algumas centenas de libs novas no NPM disponível.


Essa é uma apresentação e um artigo juntos, apenas explicando alguns dos pontos que eu considerei importante para dizer: "quer saber? vale a pena aprender Rescript e usar no dia a dia.". Esse não é um artigo para dizer que eu odeio Typescript, simplesmente porque eu não odeio typescript. Eu venho trabalhando com Typescript nos últimos dois anos e gosto muito, mas o fato de gostar não me impede de ver que TS tem seus problemas e muito o que melhorar como qualquer outra linguagem no mundo.

No final, tudo que eu quero é me sentir produtivo usando algo para resolver problemas, mas os problemas certos. Eu quero me sentir confortável em refatorar uma grande quantidade de código e se o compilador compilou com sucesso tudo vai estar certo, de verdade. Eu quero escrever mais e fazer menos porque eu sei que o compilador não vai deixar alguém usar as funções escritas da maneira errada, uma melhor inferência. Eu quero que isso seja rápido, tão rápido que eu vou salvar o arquivo duas vezes só pra ter certeza que funcionou ao invéz de abrir uma nova aba do twitter, Rescript.

Essa foi a maior introdução que eu já fiz, o que mostra o quão interessado eu estou. Daqui pra baixo vou falar sobre os pontos que me chamaram a atenção sobre Rescript para começar a aprender mais sobre a linguagem. Não significa que eu estou certo, apenas opinões.


<h2 class="subtitle--separator">Integração com JavaScript</h2>

Aqui vai uma ideia para você: Javascript é a linguagem da web! JavaScript estã em todos os lugares! Sempre aposte no JavaScript! Mesmo que você não goste disso, é a verdade. Então, um dos primeiros pontos que eu olhei foi o quão fácil seria usar algum código ou lib JavaScript sem precisar reescrever isso para Rescript.

E por quê? Porque eu não quero parar de usar JavaScript. Se alguma Tec nova super legal como Xstate surgir ou uma nova API no Browser, eu quero ser capaz de usar no meu código Rescript de alguma forma, mesmo se a linguagem não tem suporte oficial para isso ainda. Isso precisa ser fácil e rápido de criar se precisar.

Vamos supor que eu queira usar Lodash, esperando por comentários: "você não precisar usar lodash, bla bla bla..." Eu aposto que Lodash já salvou sua vida muitas vezes e é só um exemplo. Continuando, tudo que você precisaria fazer seria definir um arquivo de bindings muito similar com o que fariamos em Typescript, por exemplo:

Nós criamos um arquivo `Lodash.res`: 

```js
@module("lodash/chunk")
external chunk: (array<'a>, int) => array<array<'a>> = "default"
```
E então em algum outro arquivo, usariamos o módulo Lodash:

```js
let myArray = [1,2,3]
let chunks = Lodash.chunk(myArray, 2)
```
Você também pode exportar muitas funções do mesmo módulo, voltando ao nosso arquivo `Lodash.res`:

```js
@module("lodash")
external chunk: (array<'a>, int) => array<array<'a>> = "chunk"

@module("lodash")
external difference: (array<'a>, array<'a>) => array<'a> = "difference"
```
E usar da mesma forma:

```js
let myArray = [1,2,3]
let chunks = Lodash.chunk(myArray, 2)
let difference = Lodash.difference(myArray, [2])
```

<h2>Output legível</h2>

O código gerado pelo compilador do Rescript é legível para humanos, limpo e mínimo. O que faz o tamanho do nosso bundle ser bem similar como se fosse alguma pessoa escrevendo o Javascript. Veja o examplo do código acima gerado pelo compilador:

```js
// Generated by ReScript, PLEASE EDIT WITH CARE

import * as Lodash from "lodash";

var myArray = [
  1,
  2,
  3
];

var chunks = Lodash.chunk(myArray, 2);

var difference = Lodash.difference(myArray, [2]);

export {
  myArray ,
  chunks ,
  difference ,
  
}
/* chunks Not a pure module */
```

<h2>É Rescript ou JavaScript?</h2>

Outro ponto importante é sobre a syntax, que é muito parecida com JavaScript. Rescript é outra linguagem diferente do Typescript que é feito baseado em JavaScript, então ter uma syntax parecida é muito bom para aprender rápido e ser produtivo com a linguagem de forma rápida. Para prover esse ponto, vamos fazer um exercício chamado: "É Rescript ou JavaScript?"

**É Rescript ou JavaScript?**

```js
let person = {
  "age": 5,
  "name": "Big ReScript"
}
```

`Rescript!`

**É Rescript ou JavaScript?**

```js
let add = (a, b) => a + b
let addTwo = add(2)
let test = addTwo(10) // 12
```

`Rescript!` JS não é curried por default, mais sobre isso abaixo.

**É Rescript ou JavaScript?**

```js
let myArray = ["hello", "world", "how are you"]

let firstItem = myArray[0] // "hello"
```

`Rescript!`

De fato, quase todos os exemplos funcionariam nos dois mundos. A diferença é que com Rescript nós teriamos a ajuda do compilar com uma inferência de tipos maravilhosa para nos ajudar a escrever um código melhor e mais seguro, isso sem nem precisar escrever nenhum tipo até agora.

Claro que existem algumas diferenças tanto de syntax como de como a linguagem funciona, mas são tão pequenas que é apenas saber que elas existem. Por exemplo, ifs:

```js
let showMenu = true;

if showMenu {
  displayMenu()
} else {
  Js.log("nothing here...")
}
```

Nós não precisamos usar parenteses em Rescript.

<h2>Sem Imports</h2>

Diferente de JS, não existe export e import em Rescript. O que acontece é que em Rescript todos os arquivos são um modulo e o nome do arquivo precisa ser único, mesmo arquivos dentro de pastas são acessados de forma global no mesmo nível que qualquer outro arquivo. Você só precisa usar o NomeDoArquivo que precisa ser em CamelCase ponto o tipo/função que você quer usar.

Nós também podemos usar `open` e ao invéz de usar **NomeDoModule.AlgumaCoisa** todas as vezes, nós fariamos:

```js
open Lodash

let myArray = [1,2,3]
let chunks = chunk(myArray, 2)
```

Não ter imports/exports e ter um sistema de módulos por arquivo, nos força a manter uma estrutura mais flat que tem grandes vantagens a longo prazo.

Trecho tirado da documentação do Rescript:

>  By default, every file's type declaration, binding and module is exported, aka publicly usable by another file. This also means those values, once compiled into JS, are immediately usable by your JS code.

<h2>Sistema de Tipos</h2>

Bom eu poderia escrever alguma coisa com as minhas palavras, mas o time do Rescript fez um trabalho tão bom no site da documentação que eu vou apenas colar aqui o trecho sobre tipos:

> Types are the highlight of ReScript! They are:
>
> Strong. A type can't change into another type. In JavaScript, your variable's type might change when the code runs (aka at runtime). E.g. a number variable might change into a string sometimes. This is an anti-feature; it makes the code much harder to understand when reading or debugging.
>
>  Static. ReScript types are erased after compilation and don't exist at runtime. Never worry about your types dragging down performance. You don't need type info during runtime; we report all the information (especially all the type errors) during compile time. Catch the bugs earlier!
>
>  Sound. This is our biggest differentiator versus many other typed languages that compile to JavaScript. Our type system is guaranteed to never be wrong. Most type systems make a guess at the type of a value and show you a type in your editor that's sometime incorrect. We don't do that. We believe that a type system that is sometime incorrect can end up being dangerous due to expectation mismatches.
>
>  Fast. Many developers underestimate how much of their project's build time goes into type checking. Our type checker is one of the fastest around.
>
>  Inferred. You don't have to write down the types! ReScript can deduce them from their values. Yes, it might seem magical that we can deduce all of your program's types, without incorrectness, without your manual annotation, and do so quickly. Welcome to ReScript =).

Vamos explorar um pouco mais essa ideia de inferência, que é uma das partes mais legais do Rescript. Escreva menos e faça mais!

Vamos considerar a seguinte função:

```js
let add = (a, b) => a + b
```

Veja o que o compilador diria se você tentasse usar essa função passando duas strings ao invéz de numeros:

```js
We've found a bug for you!
  /Users/dielduarte/localhost/testing-rescript/src/ExternalLibs.res:3:5-8

  1 │ let add = (a, b) => a + b
  2 │
  3 │ add("11", "2")

  This has type: string
  Somewhere wanted: int

  You can convert string to int with Belt.Int.fromString.

FAILED: cannot make progress due to previous errors.
>>>> Finish compiling(exit: 1)
```

Isso é como o compilador do TS deveria funcionar 😅 com Rescript eu sinto que estou a todo momento programando com um colega do lado. O compilador me mostra o erro, porquê, e ainda como resolver o problema e repare novamente, nós não tivemos que escrever nenhum tipo até então.

Mas como isso é possível? Bom, em Rescript usando o sinal `+` só é valido para numeros, então o compilador infere que por default a função Add só funciona para numeros. If você quisesse concatenar strings, teria que usar `++`.


<h2>Variants</h2>

A maioria das estruturas de dados em linguagens de programção são sobre "isso e aquilo". Variants nos permite expressar "isso ou aquilo".

Varians no primeiro olhar, se parecem com Enum com superpoderes.

Um exemplo simples seria:

```js

type myResponse =
  | Yes
  | No
  | PrettyMuch

let areYouCrushingIt = Yes

```
Olá enums, meu velho amigo.

Mas agora vem os super poderes, uma variant pode conter argumentos separado por uma virgula. Exemplo:

```js
type account =
  | None
  | Instagram(string)
  | Facebook(string, int)
```

Então, para o mesmo tipo você poderia usar:

```js
let myAccount = Facebook("Josh", 26)
let friendAccount = Instagram("Jenny")
```

Variants também podem receber um Record (objeto):

```js
type user =
  | Number(int)
  | Id({name: string, password: string})

let me = Id({name: "Joe", password: "123"})
```
`me` continua sendo do tipo user, mas uma variant diferente. Usar pattern matching + variants é uma técnica muito poderosa, e pode até evitar algumas issues de performance como você pode ver [aqui](https://rescript-lang.org/docs/manual/latest/variant#design-decisions) onde nós conseguimos reduzir a complexidade do nosso programa de O(n) para O(1).


<h2>Pattern matching</h2>

Se variants são enums com super poderes, pattern matching é o switch com super poderes. Misturar os dois é 🤯

Nós podemos usar pattern matching para testar variações de qualquer tipo de formas diferentes, o exemplo abaixo estã testando se temos um `Number(id)` ou um `Id({ name: Jow"" })` um Id com o nome exatamente igual a Joe ou qualquer `Id(options)`

```js

type user =
  | Number(int)
  | Id({name: string, password: string})

let me = Id({name: "Joe", password: "123"})

switch me {
| Number(id) => Js.log("Your id is => " ++ Js.Int.toString(id))
| Id({name: "Joe"}) => Js.log("Welcome Joe!")
| Id(option) => Js.log("Welcome =>" ++ option.name)
}
```
Pattern matching podem ser usados para testar qualquer tipo, listas, arrays, tuplas, variants e mais. E como se isso não fosse o suficiente, pattern matching também é exaustivo. Isso significa que todas as vezes que você estiver testando uma variavél, o compilador te obriga a testar todos os padrões que aquela variável pode ter, e se por acaso você esquecer disso, o compilador te lembra. Vamos supor que eu esqueci de tratar a variant `Id` no exemplo acima, o compilador me mostraria o seguinte erro:

```js
Warning number 8
  /Users/dielduarte/localhost/test-rescript/src/ExternalLibs.res:7:1-9:1

  5 │ let me = Id({name: "Joe", password: "123"})
  6 │
  7 │ switch me {
  8 │ | Number(id) => Js.log("Your id is => " ++ Js.Int.toString(id))
  9 │ }

  You forgot to handle a possible case here, for example:
  Id _

>>>> Finish compiling 128 mseconds
```

<h2>Curried por default</h2>
Essa é uma das curiosidades sobre Rescript que eu mais curti. Todas as funções em Rescript são curried por default, isso significa que, nós podemos usar partial application sempre que for necessário escrevendo menos código para isso.

Em Javascript, para criar o exemplo que usamos acima nós precisariamos usar closures ou algum helper tipo [Lodash curry](https://lodash.com/docs/4.17.15#curry):

```js
let add = (a) => (b) => a + b //closure
let addTwo = add(2)
let test = addTwo(10) // 12
```

Em Rescript nós escreveriamos a função da mesma forma mas usuarimos de forma parcial:

```js
let add = (a, b) => a + b
let addTwo = add(2)
let test = addTwo(10) // 12
```

<h2>Labeled arguments</h2>

Em Javascript/Typescript nós estamos acostumados a usar um objeto como argumento para saber quais os nomes dos argumentos quando usando a função sem precisar ir para a definição da mesma e também, para poder passar os argumentos em qualquer ordem, exemplo:

```js
function updateUser(userOptions) {
  ....
}

//using the function
updateUser({
  name: 'Diel',
  age: 26
})
```

Em Rescript também é possível passar um objeto, MAS, existe algo chamado "labeled arguments" que é basicamente nomear os argumentos com um `~` na frente, dessa forma todas as vezes que usar a função poderiamos passar o nome do argumento em qualquer ordem, exemplo:

```js
let updateUser = (~name, ~age) => {
  ...
}

//usando a fn
updateUser(~age=26, ~name="Diel") // arqui você passar o argumento em qualquer ordem
```

Lembra que todas as funções são curried por default? Com labeled arguments nós podemos usar a função de forma parcial passando os argumentos em qualquer ordem, exemplo:

```js
let add = (~a, ~b) => a + b
let addTwoToA = add(~b=2)
let test = addTwoToA(~a=10)
```

<h2>Rescript não tem null nem undefined</h2>

Isso é ótimo! Nós não precisamos nos preocupar com categoria inteira de bugs, de toda forma a ideia de ter um valor não existente continua sendo muito útil e por isso Rescript em o Option.

Um Option pode ser repesentado por `Some(Value)` ou `None` variants, e todas as vezes que você utilizar uma variável do tipo Option, Rescript vai te forçar a tratar todas as variações de forma exaustiva.

Por exemplo, um avatar de usuário é bem possível que seja inexistente em muitas aplicações.

```js
let userAvatar = Some("url...")

switch userAvatar {
| None => Js.log("The user doesn't have an avatar, let's show initials")
| Some(url) => Js.log("The user's avatar is " ++ url)
}
```

E se você esquecer de tratar uma das variantes, o compilados vai te mostrar:

```js

Warning number 8
  /Users/dielduarte/localhost/testing-rescript/src/ExternalLibs.res:3:1-5:1

  1 │ let userAvatar = Some("url...")
  2 │
  3 │ switch userAvatar {
  4 │ | Some(url) => Js.log("The user's avatar is " ++ url)
  5 │ }

  You forgot to handle a possible case here, for example:
  None

>>>> Finish compiling 82 mseconds
```
😍 As vezes eu queria dar um beijo no compilador.

<h2>Fácil de usar com qualquer ferramenta do ecosistema JS</h2>

Como Rescript compila para JS, você pode usar Rescript com qualquer ferramenta que funciona para JS, create-react-app, snowpack, Webpack, Babel, Rome, e mais...Qualquer coisa que funcione para JS vai funcionar em Rescript, porquê a ideia é:

Rescript compila para JS => e então qualquer ferramenta entende os arquivos JS gerados e simplesmente funciona! As ferramentas não necessariamente precisam saber que você está usando Rescript. Para provar isso, eu criei esse template para usar Rescript com o Snowpack. Você pode acessar o código aqui:

[dielduarte/react-snowpack-rescript-template](https://github.com/dielduarte/react-snowpack-rescript-template)

Você pode ver que para inicializar o server do snowpack, eu importei o arquivo index.bs.js gerado pelo Rescript dentro do index.html [here](https://github.com/dielduarte/react-snowpack-rescript-template/blob/main/index.html#L13)

<h2>Conclusão</h2>

Como eu disse no começo do post, a ideia aqui foi falar sobre alguns pontos que eu achei interessante para começar a estudar mais sobre Rescript. Então eu não falei de muitas coisas sobre a linguagem e suas vantagens, mesmo assim, eu espero que esse artigo te ajude a ter mais interesse em aprender mais sobre Rescript.

E para você, vale a pena estudar Rescript?