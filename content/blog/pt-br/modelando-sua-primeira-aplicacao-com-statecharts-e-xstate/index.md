---
title: Modelando sua primeira aplicação com Statecharts e Xstate
date: "2020-11-22"
description: Nesse e nos próximos posts vamos contruir uma aplicação utilizando Statecharts e a ajuda da lib Xstate...
languageKey: pt_br
languageLink: /en/modeling-your-first-application-using-statecharts-and-xstate
---


Nesse e nos próximos posts vamos contruir uma aplicação utilizando Statecharts e a ajuda da lib Xstate. Os posts serão quebrados em 2 partes:

- O post que você está lendo será como modelar sua aplicação utilizando Statecharts e Xstate/Viz onde vamos cubrir alguns dos principais conceitos de Statecharts.
- Escrevendo sua aplicação com React e Xstate

Sem mais delongas, bora pro post de hoje!

Antes de começarmos a modelar uma aplicação, precisamos entender um pouco mais sobre alguns dos conceitos de Statecharts, vale lembrar também que todos os exemplos serão usando Xstate mas você não precisa de nenhuma lib para começar usar hoje mesmo. Durante o desenvolvimento do modelo, vamos cobrir os seguintes conceitos:

- context
- state
- invoke
- actions
- guards

Uma das features mais legais do Xstate é poder vizualizar seu código, hoje vamos usar o xstate/viz que vai nos ajudar a criar nosso modelo. Antes de mais nada, abra o seguinte link: xstate/viz , você provavelmente verá uma página igual a da imagem abaixo, ele irá iniciar com uma fetch machine e com o código do exemplo do lado direito.

![imagem mostrando o xstate/viz aberto com uma fetch machine.](/blog/images/modeling-your-first-application-using-statecharts-and-xstate/image-1.png)

A primeira coisa que vamos fazer é atualizar o código no Xstate/Viz para o código abaixo e clicar em update:

```js
const catsApp = Machine({
    id: 'catsApp',
    initial: 'idle',
    states: {
      idle: {}
    }
  });
```

O código acima é o código basico para iniciarmos uma nova State Machine, cada state machine recebe um id único, um estado inicial e claro, a lista de estados disponíveis. O resultado será:

![imagem mostrando o resultado do codigo colado no xstate/viz](/blog/images/modeling-your-first-application-using-statecharts-and-xstate/image-2.png)

A primeira coisa a se fazer é pensar em quais estados nossa aplicação pode ter, nesse exemplo vamos criar uma aplicação que, ao clicar em um botão busca de uma API uma imagem de um gatinho. A aplicação também tratará errors na api, habilitando o usuário a tentar novamente por 3 vezes consecutivas caso a API retorne errors.

Com essa breve descrição podemos então dizer que nossa aplicação terá os seguintes estados:

- idle
- loading
- success
- error
- cant_retry

O resultado em código ficaria assim:


```js
const catsApp = Machine({
    id: 'catsApp',
    initial: 'idle',
    states: {
      idle: {},
      loading: {},
      success: {},
      error: {},
      cant_retry: {}
    }
  });
```

E o resultado no xstate/viz:

![imagem mostrando o resultado do codigo colado no xstate/viz](/blog/images/modeling-your-first-application-using-statecharts-and-xstate/image-3.png)

Não se preocupe caso você esqueça de algum estado da primeira vez, aos poucos e com prática você vai pegando maldade e vai conseguir ser mais assertivo em quais estados sua aplicação ou seu componente deve ter. Alterar caso precise é mais simples do que parece, você pode usar o xstate/viz para te ajudar a vizualizar as mudanças e testar todos os fluxos possíveis.

Lembra do nosso diagrama de transição de estados falado no primeiro post dessa série, onde mostramos que começando em um estado A ⇒ um vento X aconteceu ⇒ vamos para um estado B ? O próximo passo é definir quais eventos dentro do seu sistema força uma transição de estado. Exemplo, quando estamos no estado inicial (**idle)** podemos dizer que o evento **LOAD_NEW_PICTURE** força uma transição para o estado **loading** ou seja:

- **idle ⇒ LOAD_NEW_PICTURE ⇒ loading**
- **loading ⇒ ON_DONE ⇒ sucess**
- **loading ⇒ ON_ERROR ⇒ error**
- **success ⇒ LOAD_NEW_PICTURE ⇒ loading**
- **error ⇒ RETRY ⇒ loading**

Em código ficaria:


```js
const catsApp = Machine({
    id: 'catsApp',
    initial: 'idle',
    states: {
      idle: {
        on: {
          LOAD_NEW_PICTURE: 'loading'
        }
      },
      loading: {
        on: {
          ON_DONE: 'success',
          ON_ERROR: 'error'  
        }
      },
      success: {
        on: {
          LOAD_NEW_PICTURE: 'loading'
        }
      },
      error: {
        on: {
          RETRY: 'loading'
        }
      },
      cant_retry: {}
    }
  });
```

e no xstate/viz:

![imagem mostrando o resultado do codigo colado no xstate/viz](/blog/images/modeling-your-first-application-using-statecharts-and-xstate/image-4.png)

Vizualizar seu código é muito interessante, no exemplo acima, podemos ver nitidamente qual evento leva a aplicação para outro estado e todos os fluxos possíveis. E inclusive furos no sistema, veja como o estado cant_retry nunca acontecerá pois nenhum evento força uma transição até ele 🤷‍♂️ mas calma, nós vamos chegar lá.

### Context

Context é uma feature da lib Xstate que ter permite salvar contextos dinâmicos dependendo do estado que sua aplicação está. Context nesse caso é o nosso famoso estado como estamos acostumados a usar com outras libs como Redux, Mobx, Context Api no caso de usar com React, ou até mesmo um simples componente state.

Nesse caso, nosso contexto será a nossa foto atual para ser exibida e a quantidade de vezes que o usuário tentou buscar uma nova foto em caso de erros, precisamos iniciar nossa machine com o contexto inicial, o código então ficaria dessa forma:

```js
const catsApp = Machine({
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
        on: {
          ON_DONE: 'success',
          ON_ERROR: 'error'  
        }
      },
      success: {
        on: {
          LOAD_NEW_PICTURE: 'loading'
        }
      },
      error: {
        on: {
          RETRY: 'loading'
        }
      },
      cant_retry: {}
    }
  });
```

Perceba que nesse caso, não temos nenhuma alteração nos estados da aplicação. Mas no xstate/viz se você abrir a aba chamada `State` você pode ver que ele te mostra qual o estado atual da aplicação e qual os valores do contexto naquele momento.

![imagem mostrando a aba state no xstate/viz](/blog/images/modeling-your-first-application-using-statecharts-and-xstate/image-5.png)

### Trabalhando com ações assíncronas 

Em qualquer aplicação sempre teremos ações que são assíncronas e os resultados dessas ações podem ou não resultar em uma transição de estado. Usando Xstate chamamos isso de Services, e chamar um serviço é tão fácil e declarativo quanto qualquer outro conceito.

No nosso exemplo, o serviço será uma promise que vai fazer o request para buscar uma nova foto. O resultado dessa promise, se com sucesso ou erro gerara transições de estados. Pensando em um fluxo de dados quando a aplicação sai do estado de ocioso(idle) para loading é nesse momento que devemos então fazer nosso request. Preste bem atenção no estado de loading no proximo exemplo:


```js
const catsApp = Machine({
    id: 'catsApp',
    initial: 'idle',
	  context: {
	    currentImageUrl: undefined,
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
          onDone: 'success',
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
          RETRY: 'loading'
        }
      },
      cant_retry: {}
    }
  }, {
   services: {
     fetchNewPicture: () => fetch('') 
   }
  });
```

Substituímos nossos eventos por uma key chamada **invoke,** que recebe nesse exemplo, 3 configurações: 

- **src**:  É uma função que retorna uma promisse. No nosso código estamos passando apenas o nome da função que será chamada  e como segundo parâmetro da função **Machine**, passamos um objeto com a key **services** que nada mais é que outro objeto com todos os serviços que podem ser chamados.

- **onDone**: Qual o próximo estado vamos redirecionar nossa machine se tudo ocorrer bem.

- **onError**: Qual o próximo estado vamos redirecionar nossa machine se algum erro acontecer.

Vale lembrar que um serviço pode ser uma promisse, observables, callback ou outra machine.

A vizualização do nosso código ficaria assim:

![imagem mostrando o resultado do codigo colado no xstate/viz](/blog/images/modeling-your-first-application-using-statecharts-and-xstate/image-6.png)

Da pra perceber que o viz coloca invoke / nome do serviço dentro da quadradinho que representa o estado atual e também o nome do serviço dentro de um parênteses nos eventos simbolizando que aquele evento está relacionado ao serviço chamado.

### Actions

Actions são funções do tipo fire-and-forget, ou seja, funções  que não geram uma transição de estados. As actions porém, são muito usadas para rodar qualquer tipo de side effect que podem atualizar nosso contexto.

No nosso exemplo, quando a promisse que busca uma nova foto retorna precisamos chamar uma action para atualizar o valor do nosso contexto currentImageUrl.

Qualquer transição de estado dentro do Xstate pode receber apenas uma string com o nome do novo estado ou um objeto de configuração, onde passamos o target que representa o próximo estado e outras configurações como por exemplo, uma action. Nesse caso vamos alterar nosso invoke objeto para:

```js
invoke: {
  src: 'fetchNewPicture',
  onDone: {
    target: 'success',
    actions: ['setCurrentImageUrl']
  },
  onError: 'error'
}
```

Perceba que passamos apenas uma string que é referência para uma função action, também vamos passar a action no segundo parametro da função Machine, dessa forma, eu acredito que fica mais simples de ler nossa machine. O código final ficaria assim:


```js
const catsApp = Machine({
    id: 'catsApp',
    initial: 'idle',
	  context: {
	    currentImageUrl: undefined,
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
				    actions: ['setCurrentImageUrl']
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
          RETRY: 'loading'
        }
      },
      cant_retry: {}
    }
  }, {
   services: {
     fetchNewPicture: () => fetch('')
   },
   actions: {
     setCurrentImageUrl: (context, event) => ({
       currentImageUrl: event.data.imageUrl
     })
   }
  });
```

Uma action recebe por parâmetro, o contexto atual e um event, esse event nada mais é do que o retorno do serviço, como nosso serviço nesse caso é uma promisse, nosso event será o retorno dela. Caso nosso serviço fosse um callback por ex, esse event seria a chamada do callback com qualquer informação adicional que o serviço queira passar para a action.

A vizualização do código ficaria assim:

![imagem mostrando o resultado do codigo colado no xstate/viz](/blog/images/modeling-your-first-application-using-statecharts-and-xstate/image-7.png)

Perceba que o Viz coloca uma lista de ações que acontecem quando um evento é disparado com do / nome da action bem abaixo da representação visual de um evento.

Seguindo nosso exemplo, sempre que a promisse retornar um erro e o usuário envia o evento RETRY devemos incrementar o valor de retryTimes no nosso contexto,  também devemos resetar esse valor caso a promisse retorne com sucesso. Nesse caso, vamos adiconar uma action quando chamamos o evento RETRY e outra quando a promisse retorna com sucesso:


```js

const catsApp = Machine({
    id: 'catsApp',
    initial: 'idle',
	  context: {
	    currentImageUrl: undefined,
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
          RETRY: {
            target: 'loading'
            actions: ['incrementRetryTimes']
          }
        }
      },
      cant_retry: {}
    }
  }, {
   services: {
     fetchNewPicture: () => fetch('')
   },
   actions: {
     setCurrentImageUrl: (context, event) => ({
       currentImageUrl: event.data.imageUrl
     }),
     resetRetryTimes: () => ({ retryTimes: 0 }),
     incrementRetryTimes: (context) => ({
       retryTimes:  context.retryTimes + 1
     })
   }
  });
```

A vizualização do código ficaria assim:

![imagem mostrando o resultado do codigo colado no xstate/viz](/blog/images/modeling-your-first-application-using-statecharts-and-xstate/image-8.png)

Agora você já sabe reconhecer quando uma action é chamada apenas olhando a vizualização do código 🚀.

### Guards

Guards são usados para garantir que uma transição de estado que depende de alguma regra de negocio seja feita com segurança, usando o nosso exemplo, quando a promisse que busca uma nova foto retorna um erro, o usuário pode tentar buscar novamente por 3 vezes. Ao tentar 3 vezes e sem sucesso, o usuário é então redirecionado para um estado onde ele não pode mais tentar buscar uma nova foto.

Para fazer isso acontecer iremos usar os guards, o jeito de configurar um guard é bem simples, no nosso caso, o evento RETRY vai conter duas possíveis branchs:

```js
  error: {
      on: {
        RETRY: [
        {
          target: 'loading',
          actions: ['incrementRetryTimes']
        }, 
        {
          target: 'cant_retry'
        }
       ]
      }
    }
```


Nesse caso nada acontece, pois ainda não adicionamos o nosso guard, para adicionar um ou mais guards basta colocar uma key cond na branch que deve ser redirecionada apenas se o guard retornar true. As branchs são sempre lidas por ordem que foram declaradas, ou seja, nesse caso vamos colocar nosso guard na primeira branch, caso o retorno do guard seja falso iremos então para a próxima opção que vai então forçar uma transição de estado para o estado cant_retry,  nosso código ficaria assim:

```js
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
```

Novamente usamos a string para referenciar ao nome da função guard que estará no segundo parâmetro do método Machine, código final ficaria assim:

```js
const catsApp = Machine({
    id: 'catsApp',
    initial: 'idle',
	  context: {
	    currentImageUrl: undefined,
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
      cant_retry: {}
    }
  }, {
   services: {
     fetchNewPicture: () => fetch('')
   },
   actions: {
     setCurrentImageUrl: (context, event) => ({
       currentImageUrl: event.data.imageUrl
     }),
     resetRetryTimes: () => ({ retryTimes: 0 }),
     incrementRetryTimes: (context) => ({
       retryTimes:  context.retryTimes + 1
     })
   },
   guards: {
     canRetry: (context) => context.retryTimes <= 3
   }
  });
```

![imagem mostrando o resultado do codigo colado no xstate/viz](/blog/images/modeling-your-first-application-using-statecharts-and-xstate/image-9.png)


Perceba que agora nosso estado cant_retry tem uma ligação com o evento Retry, e nós temos dois eventos Retry que representam por ordem as branchs que declaramos. Perceba também que a primeira branch dentro do evento tem um array de guards e os nomes dessas condições, um guard fica verde em caso retorne true e vermelho em caso retorne false representando que aquele evento não vai acontecer.

### Type final

Estados do tipo final, representam que aquela machine está terminada, ou seja, nenhum evento ou transição irá acontecer depois que a machine chegar a esse estado. No nosso exemplo, o estado cant_retry é nosso estado final. Vale lembrar que uma machine não necessariamente precisa ter um estado final.

```js
const catsApp = Machine({
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
     fetchNewPicture: () => fetch('')
   },
   actions: {
     setCurrentImageUrl: (context, event) => ({
       currentImageUrl: event.data.imageUrl
     }),
     resetRetryTimes: () => ({ retryTimes: 0 }),
     incrementRetryTimes: (context) => ({
       retryTimes:  context.retryTimes + 1
     })
   },
   guards: {
     canRetry: (context) => context.retryTimes <= 3
   }
  });
```

Bom modelar uma aplicação parece divertido agora, principalmente sabendo que todo o código que escrevemos nessa tarefa é o mesmo código que será usado na aplicação final. No próximo post iremos de fato usar esse codigo e criar nossa aplicação front-end usando react e xstate.

Te vejo lá!
