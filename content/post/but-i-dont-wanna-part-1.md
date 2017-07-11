+++
date = "2017-07-11T13:55:11-05:00"
title = "But I Don't Wanna: Part 1"
description = "An ES6 Primer for Those Resistant to Change"
tags = ["es6","javascript"]
categories = ["javascript","es6"]
+++

# Part One: Getting Started
## First Things First: Everything's Gonna Be Just Fine
Hey, remember when ES6 first started coming on the scene and you were like:  
![](https://media.giphy.com/media/l0ExpNqEegk5eVW2A/giphy.gif)

It started gaining traction, new libraries were being written in it, yet still you were like:  
![](https://media.giphy.com/media/xUA7aQKbl8jk3htphS/giphy.gif)

Then friends, family, co-workers, and YouTube subscribers all started using it, and yet...  
![](https://media.giphy.com/media/3o84U1BGsvE134xA9G/giphy.gif)

It's ok, little bird. I'm gonna tell you a secret:

> The most commonly used ES6 features are little more than shorthand syntax for the language you already know and love. And guess what? You don't even have to use them.

That's right... ES6 is fully backwards-compatible with ES5. You can use as many or as few of the new features as you want.

I suggest that you incorporate as many of the new features as possible for one simple reason: ES6 is faster to write than its ES5 forefather.

By the end of this guide, you'll take your js skills from this:  
![](https://media.giphy.com/media/llKJGxQ1ESmac/giphy.gif)  

to this:  
![](https://media.giphy.com/media/fQZX2aoRC1Tqw/giphy.gif)

## But wait...
However, there are two small things we have to talk about first:  

1. Dependency Management
2. Cross-Browser Compatibility

I know I lost some readers with that tiny list alone. It's ok, the sound of their exasperation only fuels my resolve. Luckily, there are a number of tools available to mitigate each or both of these problems. The most common tool in use today is [Babel](https://babeljs.io/). However, Babel has a somewhat complicated setup and, as this book is about how to write ES6, and not how to create the best environment and toolchain, we're gonna take a short cut.

## 0-to-100: Real Quick
**Three B's: Babel, Browserify & Budo**  

* Babel: An ES6 transpiler
* Browserify: A pluggable dependency bundler
* Budo: A local server that runs browserify on your code everytime you save it  

We'll go into more depth about what these do later... but for now, clone the quickstart repo I've created and install the package dependencies:

```language-bash
$ git clone https://github.com/8-uh/es6-budo.git
$ cd es6-budo
$ npm install
```

Once the install has finished running, open the directory in your favorite text editor (I suggest [Atom](http://atom.io)). You should see a directory structure like:  
```
├── src
│  └── index.js
├── .babelrc
├── .gitignore
├── bundle.js
├── index.html
├── package.json
└── sakura.css
```

Now... jump back to your terminal and type:

```language-bash
$ npm start
```

Your browser should automatically open and you will be presented with a page that looks like:  
![Budo-ES6 Hello, World!](../../img/budo-hello-world.png)

Open your devtools console (assuming you're using chrome... which you _should_ be... press <key>cmd+alt+j</key>), and you should see:  
![budo hello console](../../img/budo-hello-console.png)

Next, jump back to your editor and change the line of code in `index.js` to:  
```js
console.log('hello, console?')
```
and save.

If you glance back at your browser's console, you'll see that the output has changed. No need to refresh! But even more importantly... you can now write cross-browser compatible ES6 code.

That's the power of Babel, Browserify, and Budo working for you.

Ten dollars says you're looking at the screen like:  
![](https://media.giphy.com/media/Hj9FQuZZIBiXS/giphy.gif)
*"I don't see the difference."*

And, if you'll just hold your horses, I'll show you...  

In part two.
