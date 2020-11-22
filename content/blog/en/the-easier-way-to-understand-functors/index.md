---
title: The easier way to understand identity functors
date: "2020-07-14"
description: the easier way to understand functors in my humble opinion is the concept of...
languageKey: en
languageLink: /pt-br/o-jeito-mais-simples-de-entender-functors
---

I really like functional programming, and have been studying it during last years, including elm and more recently Reason, just for fun. Never shipped some production ready app in these languages but really fancy the idea to bring some of their concepts to javascript. But somehow I always ended up frustrated with some functional techniques explanations,

like functors.

<h2 class="subtitle--separator">What are functors in fact?</h2>


The easier way to understand functors in my humble opinion is the concept of: 

- Functors are functions that return the value passed in a way that this value can be mapped over and over again till you get the result expected. it will help you to visualize the flow of the value transformation instead of creating multiple variables in memory in an imperative way, think like the `promise.then` method that can be chained step by step.

`talk is cheap, show me the code.`

Any type of value can be mappable with functors as we can see in the example below where money is a string:

```js
function convertMoneyToNumber(money) {
  return functor(money)
    .map(money => money.replace(/\$/, ''))
	.map(parseFloat) //same as .map(money => parseFloat(money))
    .value;
}
```

Considering we have a function like that previously:

```js
function convertMoneyToNumber(money) {
  const moneyWithoutMask = money.replace(/\$/, '');

  return parseFloat(moneyWithoutMask)
}
```

Let's create a functor helper first, this function accepts any value and makes it mappable like arrays, so now we can chain .map transforming any value on the value desired:

```js
const functor = (anyValue) => ({
  map: f => functor(f(anyValue)),
  value: anyValue
})
```

As we can see, the functor helper receives `any value` and returns an object with:

  - A method called `map` that receives a function and returns a functor of this function execution value, making the new value mappable again.

  - A field called `value` that contains the final result of the last function execution, searching you can find variants of this idea like a flatMap method that just returns the last function execution without wrapping it in a functor, then in the last execution instead of using `.map().value` you can just use `.flatMap(anyValue)`.

Now with this helper, we can convert the convertMoneyToNumber to the first example:

```js
function convertMoneyToNumber(money) {
  return functor(money)
    .map(money => money.replace(/\$/, ''))
	.map(parseFloat) //same as .map(money => parseFloat(money))
    .value;
}
```

Now we can map any type of value transforming its original value in a new value, not only arrays! Just to be clear this is just the base of the functors idea, there are many more variants.

I hope you have learned something new today! 