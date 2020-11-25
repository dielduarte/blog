---
title: Criando sua primeira aplicação com React e Xstate
date: "2020-11-24"
description: Construindo sua primeira aplicação com react e xstate...
languageKey: pt-br
languageLink: /en/creating-your-first-application-with-react-and-xstate
socialImage: /blog/images/creating-your-first-application-with-react-and-xstate/cats-app-machine.png
---

Hoje vamos criar nossa primeira aplicação utilizando o nosso modelo do post anterior que você pode ler [aqui](/pt-br/modelando-sua-primeira-aplicacao-com-statecharts-e-xstate/). Nós iremos utilizar Snowpack, React e Xstate.

Instalando dependências

Vamos utilizar o Snowpack como nosso sistema de build, e por que? Uma breve explicação pois isso daria um post separado é que o Snowpack é um sistema de build que utiliza o poder dos ESmodules em desenvolvimento, a ideia é que com ESmodules nós não precisamos de um builder em tempo de desenvolvimento já que os browsers modernos conseguem importar esmodules, isso faz com que sua ferramenta de desenvolvimento seja constante O(1) para startar seu dev server e tbm para fazer reloads ignorando o tamanho do seu projeto. Como disse isso daria um post separado que vamos ter em breve aqui no blog!

Instalando usando o create-snowpack-app:

```js
npx create-snowpack-app cats-app --template @snowpack/app-template-react --use-yarn
```


Esse comando vai criar uma pasta chamada `cats-app` com todo o boilerplate inicial para iniciar um projeto Snowpack e React. Você vai perceber abrindo o projeto que a estrutura é bem parecida com a estrutura inicial do create-react-app, então se vc já usou create-react-app alguma vez vai estar bem familiarizado.

Como disse o projeto é muito simples e a ideia aqui não é se preocupar muito com UX, eu vou utilizar nos exemplos um pouco de Taiwlind só pra deixar um pouquinho mais bonitinho, mas sendo sincero nem precisava. Basicamente nosso projeto vai conter um botão para buscar uma nova imagem, mensagem de loading ou quando algum erro acontecer e uma imagem que vai ser rederizada quando buscarmos uma nova foto de gatinho.

Iniciando o projeto, entre na pasta `cats-app` e rode:

```js
yarn start
```

Vamos entrar no nosso app.js e remover tudo deixando o arquivo assim:

```js
import React from 'react';

function App() {
  return null;
}

export default App;
```


também vamos ir em `public/index.html` e importar o Tawilind, lembrando que essa não é a melhor maneira de utilizá-lo pois dessa forma estamos importando o código inteiro e vamos utilizar nem 10% das classes disponíveis. Mas o propósito aqui não é pensar em uma aplicação performática, então serve muito bem para exemplos:

```js
<link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet">
```

### Utilizando nossa machine do exemplo anterior:

Primeiro precisamos instalar o xstate e @xstate/react

```js
  yarn add xstate @xstate/react
```
Vamos agora criar um arquivo src/app-machine.js, que vai conter a nossa machine que criamos no post anterior. 

```js
import { Machine, assign } from 'xstate';

export const AppMachine = Machine({
  id: 'catsApp',
  initial: 'idle',
  context: {
    currentImageUrl: '',
    retryTimes: 0
  },
  states: {
    idle: {
      on: {
        LOAD_NEW_PICTURE: 'loading'
      }
    },
    loading: {
      invoke: {
        src: 'fetchNewPicture',
        onDone: {
          target: 'success',
          actions: ['setCurrentImageUrl', 'resetRetryTimes']
        },
        onError: 'error'
      }
    },
    success: {
      on: {
        LOAD_NEW_PICTURE: 'loading'
      }
    },
    error: {
      on: {
       RETRY: [
        {
          target: 'loading',
          actions: ['incrementRetryTimes'],
          cond: 'canRetry'
        }, 
        {
          target: 'cant_retry'
        }
       ]
      }
    },
    cant_retry: {
      type: 'final'
    }
  }
}, {
 services: {
   fetchNewPicture: () => fetch('https://api.thecatapi.com/v1/images/search', {
     headers: {
       'x-api-key': 'sua-api-key'
     }
   }).then(response => response.json())
 },
 actions: {
   setCurrentImageUrl: assign({
      currentImageUrl: (context, event) => event.data[0].url
   }),
   resetRetryTimes: assign({ retryTimes: 0 }),
   incrementRetryTimes: assign({
     retryTimes:  (context) =>  context.retryTimes + 1
   })
 },
 guards: {
   canRetry: (context) => context.retryTimes < 2
 }
});
```


Você também vai precisar ir no site [thecatapi.com](https://thecatapi.com) e gerar uma API key. Você deve substituir `sua-api-key` pelo valor real na linha 51. 

Se você está confuso como a machine funciona ou não leu a série inteira volte no post modelando sua primeira aplicação onde montamos essa state machine do zero.

Agora vamos voltar ao nosso app.js e vamos importar useMachine hook e nossa machine para que possamos utilizala no nosso app:

```js
import React from 'react';
import { useMachine } from '@xstate/react';
import { AppMachine } from './app-machine'

function App() {
  const [current, send] = useMachine(AppMachine);  
  return null;
}

export default App;
```


Você consegue ver que useMachine hook retorna um array com dois items, o primeiro é tudo relacionado ao nosso estado atual + algumas funções úteis que podemos utilizar durante o desenvolvimento. O segundo é o metodo que chamamos de send, que é utilizado para enviar eventos para a machine, bem parecido com um dispatch do Redux.

Agora vamos montar nosso render, a princípio precisamos de um simples botão que envia  o evento `LOAD_NEW_PICTURE` para nossa machine: o código ficaria assim:

```js
import React from 'react';
import { useMachine } from '@xstate/react';
import { AppMachine } from './app-machine'

function App() {
  const [current, send] = useMachine(AppMachine);

  return (
    <button 
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" 
        onClick={() => send({ type: 'LOAD_NEW_PICTURE' })}
    >
      get new picture
    </button>
  );
}

export default App;
```


Agora nós precisamos tratar na nossa UI os quatro estados possíveis que nossa machine pode ter que é loading, success, errror, cant_retry. A fins didáticos vamos colocar tudo no render do App.js poderiamos melhorar esse código utilizando um pattern matching e separando cada variação em um componente diferente, mas o proposito aqui é ser simples. 

```js
import React from 'react';
import { useMachine } from '@xstate/react';
import { AppMachine } from './app-machine'

function App() {
  const [current, send] = useMachine(AppMachine);

  return (
    <>
      <button 
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" 
        onClick={() => send({ type: 'LOAD_NEW_PICTURE' })}
      >
      buscar uma nova foto
      </button>

      {current.matches('loading') && (
        <h3 className="text-xl text-purple-700 pt-4">loading...</h3>
      )}
      
      {current.matches('success') && (
        <img className="pt-4 pr-4 object-cover w-full h-auto" src={current.context.currentImageUrl} />
      )}

      {current.matches('error') && (
        <>
          <p className="text-lg text-red-700 mb-2 mt-2">Ops! algo deu errado</p>
          <button 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"  
            onClick={() => send({ type: 'RETRY' })}
          >
            tentar novamente
          </button>
        </>
      )}

      {current.matches('cant_retry') && (
        <p>Não é possível tentar novamente</p>
      )}
    </>
  );
}

export default App;
```


Nossa que tanto de IF Diel, o que está acontecendo? hahaha o mais legal do Xstate e State Machines no geral é que nós temos certeza que a aplicação nunca vai estar em mais de 1 estado ao mesmo tempo. Nós estamos utilizando o `current.matches` que basicamente é uma função que retorna true se o estado passado como parâmetro der match com o estado atual da machine.

Nossa aplicação está praticamente pronta, e agora vem a cereja do bolo. Já pensou em poder vizualizar seu código e sua aplicação no geral em realtime podendo ter certeza do que está acontecendo na sua aplicação naquele momento? E mais, podendo controlar a sua aplicação por essa representação visual da mesma?

A poucas semanas a galera do Xstate lançou o xstate/inspect, que basicamente abre um debugger da sua aplicação representando a machine em tempo real e totalmente dinâmico, ou seja, você consegue controlar sua aplicação através desse debugger. Vamos ver como isso funciona:

Primeiro vamos instalar o inspect:

```js
yarn add @xstate/inspect
```

No nosso app.js vamos importar e iniciar a config inicial:

```js
import { inspect } from "@xstate/inspect";

inspect({
  url: "https://statecharts.io/inspect",
  iframe: false
});
```

E no nosso useMachine hook, vamos colocar um segundo parametro `{ devTools: true }`

```js
const [current, send] = useMachine(AppMachine, { devTools: true });
```

Agora voltamos pra nossa aplicação e você vai ver que ao renderizá-la novamente o xstate/inspect vai abrir uma nova aba renderizando a sua machine em realtime e você pode tanto usar a sua aplicação e ver os resultados disso na aba do inspect quanto ao contrário, você pode enviar eventos do inspect para a sua aplicação.

<video controls="true" allowfullscreen="true">
    <source src="/blog/images/creating-your-first-application-with-react-and-xstate/video-1.mp4" type="video/mp4">
  </video>

### Simulando API retornando erro.

Para sirmularmos nossa api retornando erro, vamos substituir nosso service `fetchNewPicture` pelo código abaixo, que é que uma promisse sendo rejeitada:

```js
fetchNewPicture: () => new Promise((resolve, reject) => reject())
```

Agora ao clicar em buscar uma nova foto, automaticamente vamos ser redirecionados para o estado de error. O mais legal de State Machines e da lib Xstate por ter implementado isso é que se um evento não é tratado no estado atual, mesmo que o usuário envie esse evento, nada acontece. 

De propósito eu deixei o botão buscar uma nova foto disponÍvel sempre, tenta clicar nele 10 mil vezes você vai ver que nada acontece pois o evento LOAD_NEW_PICTURE não existe no estado de error.

Podemos ver também que nossa lógica de retry times funcionou, o usuário pode tentar novamente por 3 vezes, se por 3 vezes a api não retornou com sucesso o usuário é enviado para o estado cant_retry que é o estado final da nossa machine.


<video controls="true" allowfullscreen="true">
    <source src="/blog/images/creating-your-first-application-with-react-and-xstate/video-2.mp4" type="video/mp4">
  </video>

Por hoje é só pessoal!
