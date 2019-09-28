---
title: Mastering code splitting with webpack
date: "2019-07-17"
description: let's talk about how Webpack can help us to code splitting and achieve the goal of better website performance.
---

code splitting is a build time process that splits pieces of your code into async chunks, let's talk about how Webpack can help us to code split and achieve the goal of better website performance.


<h2 class="subtitle--separator">But first, How to know when I have to split my code?</h2>

The most expensive part of rendering websites is about downloading, and parsing  Javascript and css. That said, if we don't need to render a specific piece of code on the first render, this code is a good candidate to split and be downloaded by demand, no secrets so far.

Google Chrome has a nice dev tool called `coverage` that shows what percentage of the code delivered it's being used. This might be used as a metric to follow and know how much code might be split and downloaded by demand. 

To use the coverage tool just open your dev tools, `cmd/ctrl + p`, and type `show coverage`:

![image showing how to access coverage tab on chrome dev tools](/blog/images/coverage.png) 

then, on the coverage tab click on the reload button and wait until the website is reloaded, this will show you how much code you are using on that specific page per asset downloaded. It's AMAZING! &#128525;

![image showing coverage tab, where we can see a list of assets downloaded and how much code is not being used in red.](/blog/images/result.png) 

In the example above, 46% of the code delivered is `not` being used! but that metric is also relative, depends on file size and many other variables, so the context/scenario is super important when using these tools.


## Code splitting and webpack

With webpack we have two ways to work with code splitting, static and "dynamic" imports, both using [dynamic imports es2020 feature](https://v8.dev/features/dynamic-import)

### Static import

- Good to use when importing heavy javascript libraries/modules
- Anything temporal - things that aren't visible all the time on your page, tooltip, modal/dialog and even the rest of the page that comes only on scroll could be considered temporal
- Routes

To use static imports on your code just do: 

```js
import('path/to/myModule.js')
  .then((module) => {...})
```

Or, even better, making a function to import the module when necessary, the import of the file itself is made just one time, then is cached and the next time calling the function the module is returned instantly, e.g:

```js
const getModule = () ⇒ import('path/to/myModule.js')

getModule()
  .then(module => {...})
```

### Dynamic import

"Dynamic" imports aren't really dynamic since they are made at build time. Using dynamic imports it's like saying to Webpack: Hey Webpack, please do all possibilities of chunks in this specific path at build time. So in this way, we can pass the chunk file that we wanna import using variables which makes this process kinda dynamic.

Considering we have a folder of themes like:

```js
themes
  └── dark.js
  └── light.js
```

As an example we can do like:

```js
const getTheme = (theme) ⇒ import(`path/to/themes/${theme}`)

getTheme('dark')
  .then(theme => {...})
```

This way webpack will create chunks for each theme file inside the themes folder, this technique is called `ContextModule` into webpack code. 

## Magic comments

### webpackChunkName

```js
import(/* webpackChunkName: "my-chunk-name" */ 'path/to/myModule.js')
```

By default webpack creates chunk names following a numeral order, 1.js, 2.js, 3.js which makes the process of debugging harder to recognize which file was imported. using `webpackChunkName` we can rename the chunk file, it's important to remember that for this magic comment work we should be using the config `output.chunkFileName: [name].whateverDoYouWantHere.js` on webpack.config file.

this is only helpful on dev mode, so we can do like:

```js
if(process.NODE_ENV === 'development') {
  import(/* webpackChunkName: "my-chunk-name" */ 'path/to/myModule.js')
} else {
  import('path/to/myModule.js')
}

```

The `if` part will be removed if the build is running in production mode, and the `else` part if in dev mode. This is known as dead-code elimination, tools like Uglify.js and others do that to reduce bundle size.

### webpackMode

```js
import(/* webpackMode: "lazy" */ `path/to/themes/${theme}`)
```

the magic comment webpackMode has four types of value:

- lazy: generate chunks for each dynamic imported module, perfect choice to be used in production mode.
- lazy-once: generate a single chunk that can satisfy all calls to import statement, perfect  choice to dev mode reducing the "bundling" time.
- eager: generates no extra chunk, all modules are included in the current chunk and no additional network requests are made. 
- weak: this is useful for universal rendering when required chunks are always manually served in initial requests, a Promise is still returned, but only successfully resolves if the chunks are already with the client. If the module is not available, the Promise is rejected. A network request will never be performed

### Prefetch and Preload

```js
import(/* webpackPrefetch: true */ `path/to/themes/${theme}`)

import(/* webpackLoad: true */ `path/to/themes/${theme}`)
```

both comments above will create a link tag with `rel=prefetch` or `rel=preload` automatically for you, prefetching or preloading your chunks depends on the situation. if you don't know what prefetch and preload links do, I highly recommend you to read that post [Preload, Prefetch And Priorities in Chrome](https://medium.com/reloading/preload-prefetch-and-priorities-in-chrome-776165961bbf).

This were my notes of [Web performance with webpack](https://frontendmasters.com/courses/performance-webpack/) course, I hope you have learned something new today, see you next time! ❤️