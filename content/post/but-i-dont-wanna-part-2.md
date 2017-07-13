+++
date = "2017-07-11T13:55:11-05:00"
title = "But I Don't Wanna: Part 2"
description = "=> is your new best friend"
tags = ["es6","javascript"]
categories = ["javascript","es6"]
+++

# Part Two: wtf is `=>` all about?'

Let me introduce you to the **arrow operator**. You've probably seen this little guy hanging around code you've seen online and thought to yourself:  
![](https://media.giphy.com/media/3otPosB88Sj6KOBP44/giphy.gif)
I can assure you, without a doubt, that the arrow operator is not your nemesis. In fact, I'm willing to bet she's about to become your best friend. `=>` is, in my opinion, the single most important addition to javascript in ES6. But, enough of the sales pitch, let's see what she can actually do.

## Functional Versatility
If the statement following an arrow operator is an expression, if will be used as the return for the encapsulating function. Suppose, for a moment, that you have a function that has only one line of code:

```js
function multiply(a, b) {
  return a * b;
}

multiply(2, 4);
// -> 8
```

With the arrow operator, this can be re-written as a _function expression_:
```js
const multiply = (a, b) => a * b

multiply(2, 4);
// -> 8
```

I realize that small transformation isn't overly impressive, but using the transitive properties of algebra, we can easily create a *curried* function in a single line of code:

```js
const multiplier = a => b => multiply(a, b)
```
Or, in ES5 it would look like:
```js
function multiplier(a) {
  return function(b) {
    return multiply(a, b)
  }
}
```

Using the `multiplier` function would allow you to create a little flow like this:
```js
const double = multiplier(2)
const triple = multiplier(3)

const x = 4

double(x)
// -> 8

triple(x)
// -> 12

double(triple(x))
// -> 24

const square = b => multiplier(b)(b)
const cube = b => multiplier(square(b))(b)

square(x)
// -> 16

cube(x)
// -> 64

cube(square(x))
// -> 4096
```

Neat, right?

1[](https://media.giphy.com/media/10hvUFWkQEmoCs/giphy.gif)
* ^----- You

### A History Lesson
In the 1930's, a mathematician named Alonzo Church, following in the footsteps of predecessors such as Plato, Aristotle, Euclid, Descartes, Newton, and Liebniz, was attempting to determine the philosophical basis of mathematics. This led to Church's introduction of a formal system of mathematical logic called `lambda calculus`. There's a lot that can be said on this topic, but I'm going to be exceptionally brief (while still insisting you read [Wikipedia::lambda calculus](https://en.wikipedia.org/wiki/Lambda_calculus) and know that it is an incredibly interesting topic that is core to not only the theory of mathematics, but also philosophy, linguistics, computer science and category theory). A simple example of a lambda calculus function might look like:

\`square_sum(x,y) = x^2 + y^2\`

or, in what's called the *anonymous* form (meaning that the lambda function isn't named as above):
\`(x,y) |-> x^2 + y^2\`

Visually speaking, the above function looks a lot like the `multiply` function expression from above:
```js
(a,b) => a * b
```
Doesn't it?

There's a reason for that. A programming methodolgy arose from lambda calculus called `functional programming` and was the basis for classic languages such as LISP and APL, and the more modern Kotlin and Haskell. But, it's a little known fact that JavaScript (*née LiveScript, née MochaScript*) was originally conceived as a purely functional language and has always the hallmark traits of one, with the most obvious being the fact that developers are able to pass a function as an argument to another function. You've probably used this ability before when adding an event listener. The callback argument is always a function (or a function expression).

![](https://media.giphy.com/media/y8btJ3OOxT4sg/giphy.gif)


Ok... sorry about that... You're right... this is a lesson on the `=>` operator... and not a lesson on functional programming...


## ...or... is it?
One of the most common places you see the arrow operator is its use in certain `Array` methods. Let's say you have an array of numbers:
```js
const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
```
And your goal is to obtain an array of only the even numbers. There are a few ways to do this. The *imperative* way (that is, the non-functional way) to do this in ES5 would be:

```js
var evens = []
for(var i = 0; i < nums.length; i++) {
  var n = nums[i]
  if(n % 2 === 0) {
    evens.push(n)
  }
}
// -> evens: [2, 4, 6, 8, 10]
```

But in functional ES6:
```js
const evens = nums.filter(n => n % 2 === 0)
// -> evens: [2, 4, 6, 8, 10]
```
The `filter` Array method calls the anonymous (there's that word again) *iterator* function provided as an argument for every item in the array and then outputs a new array containing each item that the iterator function returned true for. (Whew... that was a helluva a sentence to write.) Many of the methods on the `Array` prototype follow this same pattern and are examples of functional programming inherent in javascript.

Now, let's take that same scenario and add an extra level of requirements to the goal `With the original array of numbers, calculate the sum of the squares of every even number`

Imperative ES5
```js
var sum = 0
for(var i = 0; i < nums.length; i++) {
  var n = nums[i]
  if(n % 2 === 0) {
    sum += n*n
  }
}
```

Functional ES6
```js

const square = n => n*n

const sum = nums
              .filter(n => n % 2 === 0)
              .map(square)
              .reduce((agg, n) => agg + n, 0)
```

There's a bit going on here, so let's take a closer look.
We are already familiar with the fact that our implementation of `filter` returns an array of even numbers. But, because it returns an array, we can then *flow* to another Array method called `map`. The `map` method calls the given *iterator* function argument for every element in the array and returns a new Array containing the outputs from the *iterator* function. If we were to log the output from `map` we'd see:

```
[4, 16, 36, 64, 100]
```
And, again, because the output from `map` is an array we can *flow* a `reduce` call on it. `reduce` has two arguments: the first being an *iterator* function, and the second, a seed value. The *iterator* function for `reduce` alsp expects (at least) two arguments: an aggregator value (`agg`) and an element value ('n'). For every element in the array, reduce passes in either the output from the previous iteration, or the seed value, ns value of the element. In our case, we're simply adding the value of the current element to the current total. After the last array element has been processed, `reduce` returns the value of the last iteration. Thus, the variable `sum` contains the value `220` once the iteration concludes.

*(Author's note: reword that lat paragraph)*

So far, every `iterator` method we've written has been a *pure* function. To be called *pure*, a function:

- MUST NOT change or mutate the supplied state
- MUST NOT change, mutate, or consume the value of state outside the scope of the function or cause I/O to happen (these changes are known as side-effects.)
- MUST return a new value, or function
- MUST be provable (i.e.: given the same input 1000 times, the function must return the same output 1000 times)

However, there's at least one array iteration method that is specifically designed to create side-effects.

**forEach**

Suppose we have a collection of Circle objects `{x, y, radius, color, alpha[0 - 100]}` and we want to increase the radius of each circle by 3% and decrease the opacity by 1, and then draw it using proper `p5` api calls. We could use a classic `for` loop to iterate over the collection.

Imperative ES5
```js
for(var i = 0; i < circles.length; i++) {
  var circle = circles[i]
  circle.radius *= 1.03
  circle.alpha--
  push()
  fill(circle.color)
  noStroke()
  translate(circle.x, circle.y)
  ellipse(0, 0, circle.radius, circle.radius)
  pop()
}
```

Or instead

Functional ES6
```js
// side-effects
const drawCircle = c => {
  push()
  fill(circle.color)
  noStroke()
  translate(circle.x, c.y)
  ellipse(0, 0, code.radius, c.radius)
  pop()
}

const fade = step => c => c.alpha += step
const fadeOut = fade(-1)

const stretch = percent => c => c.radius *= percent
const grow = stretch(1.03)

const transform = c => [grow, fadeOut].forEach(f => f(c))
const transformAndDraw = c => [transform, drawCircle].forEach(f => f(c))


// run every frame
draw() {
  circles.forEach(transformAndDraw)
}
```


## But Wait... There's more!

Short-hand function expressions isn't all our little friend, `=>`, can do. But you'll have to wait to find out until next time...
