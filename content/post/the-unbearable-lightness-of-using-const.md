+++
categories = ["javascript","articles"]
date = "2017-05-02T02:43:06-05:00"
description = ""
tags = ["javascript","es6",""]
title = "The Unbearable Lightness of Using `const`"
+++

It has recently come to my attention that there is some confusion in the javascript community as to the usage of `const`. If you'll allow me a few minutes and artistic license to butcher the -actual- underpinnings of memory management and registration in the V8 engine, I'll try to unravel, in as clear and plain language as possible, the mysteries of one of our newest keywords.

## Ada's Rule

First things first, there is one **immutable** rule of JavaScript:

> _Everything_ is an object.

>-- *"Ada's Rule of JavaScript"*

And, just as every mathematical theorem has addendum's, so does this one:

> Well, almost everything.

>-- *"Ada's Corollary"*

In fact, it'll be faster for me to list the values in JavaScript that aren't objects:

* `true`
* `false`
* `null`
* `undefined`


That's it. That's all there is... Everything else is either an `Object` type or a derivative there of.

## A Diversion

In most classic compiled languages, there are language-level definitions for
what are called *primitive data-types* or just *primitives*. Primitives only store only values and have no instance-methods of their own. To help extract the concepts from real-world implementation, I've created an imaginary **C**-like language called **Ay** (*Ada's Analogue*). In **Ay**, there exists four language-defined primatives:

* int - stores integer values
* float - stores floating point numbers
* char - stores a single character
* bool - stores boolean (true/false) values

In **Ay**, when the compiler is run, the application allocates memory in the stack for each variable based on this data type. If you're unfamiliar with the concept of the stack, don't worry about it (and if you are, just hang with me while I build an imperfect, but easy to understand analogy). Broadly speaking, the stack is the lot of memory that the application is allowed to use. To help visualize this, imagine a grid:


### **Ay** Memory Stack

|   | A | B | C | D | E | F |
----|---|---|---|---|---|---|
| 0 | • | • | • | • | • | • |
| 1 | • | • | • | • | • | • |
| 2 | • | • | • | • | • | • |
| 3 | • | • | • | • | • | • |
| 4 | • | • | • | • | • | • |
| 5 | • | • | • | • | • | • |

Using the magic of Suspension of Disbelief (for those who understand this concept better than I), one of the things that **Ay** does during compilation, is allocate the same amount of memory for every primitive data type. That is, each cell in the grid above can hold either an **int**, **float**, **char** or **bool**. In the real world, things are not this perfect, but again, shooting for ease of explanation, and not accuracy.

Take a look at the following simple **Ay** program
```C
int n = 42;
print(n);
```
All this program does is define an **int** called *n* with the value of **42** on line 1, and then print it to the console on line 2. The simplest program possible.

What the compiler does is grab an unused cell from the stack and shove the value of `42` into that location in memory. Running this program, the memory stack could look like this after executing line 1:

|   | A | B | C | D | E | F |
----|---|---|---|---|---|---|
| 0 | `42` | • | • | • | • | • |
| 1 | • | • | • | • | • | • |
| 2 | • | • | • | • | • | • |
| 3 | • | • | • | • | • | • |
| 4 | • | • | • | • | • | • |
| 5 | • | • | • | • | • | • |


When line 2 runs, the program knows to look in memory at the location `B:2` to find the value of **n** and then display it to the screen. But what happens if the value of `n` changes?

```C
int n = 42;
print(n);
n = 13;
```

Exactly what you'd expect, I'm sure:

|   | A | B | C | D | E | F |
----|---|---|---|---|---|---|
| 0 | `13` | • | • | • | • | • |
| 1 | • | • | • | • | • | • |
| 2 | • | • | • | • | • | • |
| 3 | • | • | • | • | • | • |
| 4 | • | • | • | • | • | • |
| 5 | • | • | • | • | • | • |

Putting it simply, changing a primitive value changes the value stored in the memory allocated for that variable.

Here's an example with all primitive types used:
```C
int n = 42;
float f = 3.14159;
char c = 'c';
bool b = false;

print(n);
print(f);
print(c);
print(b);
```

And the memory stack after line 4:

|   | A | B | C | D | E | F |
----|---|---|---|---|---|---|
| 0 | `42` | • | • | • | • | • |
| 1 | • | `3.14159` | • | • | • | • |
| 2 | • | • | `'c'` | • | • | • |
| 3 | • | • | • | `false` | • | • |
| 4 | • | • | • | • | • | • |
| 5 | • | • | • | • | • | • |

If only life could be as simple as those four primitives... But, alas, sometimes we need more complicated data structures to describe our world. Luckily, **Ay** is an object-oriented language that allows the definition of complicated data structures from those four types. My fiancé is studying for finals right now, so I'm going to create an example **Ay** class called `ExamRecord` that fits into a larger imaginary application. For ease of discussion, the exams are anonymized with a Student ID on the scantron instead of a name (that way the professor can't play favorites and bump the grade). As such, each `ExamRecord` object will need to store an `int` representing the student ID, a numerical grade stored as a `float`, and a `char` letter grade:

```C
class ExamRecord {
  int studentID;
  float examGrade;
  char letterGrade;
}
```

Luckily for this article, the **Ay** language auto-magically assigns the correct arguments to an instance's properties when the constructor is called. It also applies a method on every class instance called `dump()` that will print the class's properties in a pretty format. For instance:

```C
ExamRecord er = new ExamRecord(1430, 86.3, 'B');
er.dump();
```
would produce:

```text
--Exam Record------------
        studentID:   1430
        examGrade:   86.3
      letterGrade:      B
-------------------------
```

(One of the nicest things about using an imaginary language is that it can do whatever you want it to without writing a single line of code...)

Take a close look at the memory stack for this new program, and you'll see something interesting:

|   | A | B | C | D | E | F |
----|---|---|---|---|---|---|
| 0 | ExamRecord {<br/>studentId: B:1,<br/>examGrade: C:1,<br/>letterGrade: D:1<br/>} | • | • | • | • | • |
| 1 | • | `1430` | `86.3` | `'B'` | • | • |
| 2 | • | • | • | • | • | • |
| 3 | • | • | • | • | • | • |
| 4 | • | • | • | • | • | • |
| 5 | • | • | • | • | • | • |

The memory location for `er` doesn't contain the values for each of the properties of `er`, but instead contains the memory locations for each value of `er`. **Ay** allows changing the values for each property thusly:

```C
er->examGrade = 92.4;
er->letterGrade = 'A';
```
The `->` operator, in practice, is the same as the `.` operator in JavaScript. That is, it tells the `er` object to **access** the identified property. However, the theoretical difference here is that we're telling the `er` object to **point** to the memory location for the identified property and then access that location's value. The memory stack's state will look like this:


|   | A | B | C | D | E | F |
----|---|---|---|---|---|---|
| 0 | ExamRecord {<br/>studentId: B:1,<br/>examGrade: C:1,<br/>letterGrade: D:1<br/>} | • | • | • | • | • |
| 1 | • | `1430` | `92.4` | `'A'` | • | • |
| 2 | • | • | • | • | • | • |
| 3 | • | • | • | • | • | • |
| 4 | • | • | • | • | • | • |
| 5 | • | • | • | • | • | • |

Once, we've set the properties for an `ExamGrade` and saved it (via some other method we've written called `saveExamRecord()`), we'll want to create another. An expanded snippet might look like:

```C
ExamRecord er = new ExamRecord(1430, 86.3, 'B');
saveExamRecord(er);
er = new ExamRecord(1215, 71.8, 'C');
```

|   | A | B | C | D | E | F |
----|---|---|---|---|---|---|
| 0 | ExamRecord {<br/>studentId: B:1,<br/>examGrade: C:1,<br/>letterGrade: D:1<br/>} | • | • | • | • | • |
| 1 | • | `1430` | `92.4` | `'A'` | • | • |
| 2 | ExamRecord {<br/>studentId: B:3,<br/>examGrade: C:3,<br/>letterGrade: D:3<br/>} | • | • | • | • | • |
| 3 | • | `1215` | `71.8` | `'C'` | • | • |
| 4 | • | • | • | • | • | • |
| 5 | • | • | • | • | • | • |

Notice that when the `new` operator is used, the program creates the instance of `ExamRecord` in an unused memory location, instead of using a previously occupied one, which differs from what happens when you assign a new value to a primitive data type. Don't worry about what happens to the old instance. But if you need an explanation we'll go with: the old instance wanders into the dark and is eaten by a grue.

## This all seems irrelevant.
In reality, it's incredibly irrelevant. But, like I said, this is all merely an analogy to help understand what happens when `const` is used. The previous exercise is a "Good Enough(tm)" high-level overview of what happens in a compiled language to help explain what's going on in JavaScript when `const` is used. But, there's one concept that needs to be revisited, and this time I'm going to yell it so that it appears larger on the page:

> _EVERYTHING_ IS AN OBJECT!

>-- *"Ada's Rule of JavaScript"*

As previously stated: JavaScript has no primitives. Everything is an object. That being said, JavaScript has some data types that *act* like primitives. For example:

```javascript
var n = 42
console.log(n)
var x = 13
console.log(x)
```
Will produce the output:
```text
> 42
> 13
```


The variables `n` and `x` are not of type `int` or `float`. They are `Number` objects that have methods built into them like `toFixed()`, `toString()` and `valueOf()`. In fact, the previous can be re-written as:

```javascript
var n = new Number(42)
console.log(n.valueOf())
var x = new Number(13)
console.log(x.valueOf())
```

and the stack will look something like:

|   | A | B | C | D | E | F |
----|---|---|---|---|---|---|
| 0 | Number { PrimitiveValue: B:1 } | • | • | • | • | • |
| 1 | • | `42` | • | • | • | • |
| 2 | Number { PrimitiveValue: B:3 } | • | • | • | • | • |
| 3 | • | `13` | • | • | • | • |
| 4 | • | • | • | • | • | • |
| 5 | • | • | • | • | • | • |

Further more, an interesting thing happens when you reassign a `Number` object's value. Take the following for example:


```javascript
var n = 42
console.log(n)
n = 13
console.log(n)
```

with the output:
```text
> 42
> 13
```

At the end of execution, the memory stack will look like:

|   | A | B | C | D | E | F |
----|---|---|---|---|---|---|
| 0 | Number { PrimitiveValue: B:1 } | • | • | • | • | • |
| 1 | • | `42` | • | • | • | • |
| 2 | Number { PrimitiveValue: B:3 } | • | • | • | • | • |
| 3 | • | `13` | • | • | • | • |
| 4 | • | • | • | • | • | • |
| 5 | • | • | • | • | • | • |

Scroll up a bit and compare it to the previous memory stack. Go on... I'll wait...

*Ada whistle's a few bars of "Girl from Impanema"*

Welcome back. Did you see it? It's exactly the same. In JavaScript, assigning a number to a variable does **not** change the value of the `Number` object assigned to the variable, but instead creates a **new** `Number` object in memory and directs the variable to **point** (remember the `->` operator?) at the new memory location. While that sinks in, I must make a little service announcement...

## DISCLAIMER: THIS IS NOT ACTUALLY WHAT HAPPENS
Look, if -anybody- reads this, I know I'm going to get comments like "lol, no.", "do u even language spec, bro?" (not a bro), and/or long rants about how the V8 engine is entirely more complex than the drivel I've written.

And those people are absolutely correct.

The truth is, memory management in JavaScript is infinitely more complex than what I've described. For instance, this article doesn't take into account the fact that V8 uses a `Context` object to encapsulate variables that exist in different scopes, nor does it actually create new `Number` objects when you change the value of `n` (it... kinda does, but... it... kinda doesn't? It's... difficult to explain... hell, it's difficult to understand... so much so, that I couldn't accurately explain it if directly asked to).

However, the creators of ES6/7/8+ have made it their goal to make JavaScript feel more like it's Object-Oriented cousins (C++, Java, Swift) and less like it's LISP-y ancestors. That is, they have applied syntactic sugar that appears to make ES6 adhere to a more classic paradigm. As such, all of these under-the-hood mechanics can now be more easily explained using classic ideology than first wading through the muck of (what is now all but obsolete) paradigms such as prototypical inheritance (yes, commenters, I'm aware that it's still what happens behind the scenes and that there are instances where it is more powerful than the `class` syntax).

All of that being said, please do -not- take this article as Gospel. Consider it as you would the idea of Schroedinger's Box: It's imperfect and simplistic, but it gets the idea across and provides a launching pad for further understanding of a complex subject.

If you'd still like to eviscerate me in the comments, please at least show you've done me the courtesy of reading this section by tagging your comment with `#lovenopes`, and I promise I'll read, respond, argue, and if necessary, amend the original article to include the new information. I want to be as knowledgable as you are, and beyond that, I want all those who aren't to get the right information.

## And... we're (h|b)ack
Thank you for indulging me that brief interlude... Upon re-reading everything up to this point, I realize I haven't answered the question that should be in your head right now: **What does this have to do with `const`?**

In our imaginary language, **Ay**, assigning a new `ExamGrade` instance to a variable actually points the variable to a new memory location that stores the individual memory locations for each property. In JavaScript, assigning an Object (that is, assigning -almost- anything) to a variable does the same thing. When you use either `var` or `let` (which is another article altogether), to store an Object, you are telling the interpreter that it's ok to assign a different memory location to the defined variable at a later time. When you use `const` however, the interpreted understands that once the memory address for that object is assigned, it is not allowed to assign it a different address ever again. However, this instruction does not apply to an object's properties.

For instance, the `ExamRecord` class in JavaScript:
```javascript
class ExamRecord {
  constructor(studentID, examGrade, letterGrade) {
    this.studentID = studentID
    this.examGrade = examGrade
    this.letterGrade = letterGrade
  }
}
```

and in the main program:
```javascript
const er = new ExamRecord(1430, 86.3, 'B')
```

The stack will look something like:

|   | A | B | C | D | E | F |
----|---|---|---|---|---|---|
| 0 | ExamRecord {<br/>&nbsp;&nbsp;studentId:&nbsp;&nbsp;&nbsp;B:1,<br/>&nbsp;&nbsp;examGrade:&nbsp;&nbsp;&nbsp;B:2,<br/>&nbsp;&nbsp;letterGrade:&nbsp;B:3<br/>} | • | • | • | • | • |
| 1 | • | Number {PrimitiveValue: C1} | `1430` | • | • | • |
| 2 | • | Number {PrimitiveValue: C2} | `86.3` | • | • | • |
| 3 | • | String {PrimitiveValue: C3} | `'B'` | • | • | • |
| 4 | • | • | • | • | • | • |
| 5 | • | • | • | • | • | • |

If you tried to directly change the value of `er` like so:

```javascript
er = 12
```
In essence, you would be creating a new `Number` object, which would be created at a new memory location (let's say `A:5`), and then attempting to point `er` at the new memory location.

And you'd get a nasty looking error:
<pre style="color: red">
<code>VM23194:1 Uncaught TypeError: Assignment to constant variable.</code>
</pre>

However, if you attempted to change a property of `er`, say the `examGrade` property:

```javascript
er.examGrade = 92.6
```

Everything would work correctly. The memory stack would look like:

|   | A | B | C | D | E | F |
----|---|---|---|---|---|---|
| 0 | ExamRecord {<br/>&nbsp;&nbsp;studentId:&nbsp;&nbsp;&nbsp;B:1,<br/>&nbsp;&nbsp;examGrade:&nbsp;&nbsp;&nbsp;B:2,<br/>&nbsp;&nbsp;letterGrade:&nbsp;B:3<br/>} | • | • | • | • | • |
| 1 | • | Number {PrimitiveValue: C1} | `1430` | • | • | • |
| 2 | • | Number {PrimitiveValue:<pre style="color:red; display: inline;margin-left: 0px; padding-left: 0px"> D2</pre>} | `86.3` | <pre style="color:red; display: inline;margin-left: 0px; padding-left: 0px"> 92.6</pre> | • | • |
| 3 | • | String {PrimitiveValue: C3} | `'B'` | • | • | • |
| 4 | • | • | • | • | • | • |
| 5 | • | • | • | • | • | • |

This example works because an object's properties are not defined as `const` and are thusly allowed to point at any memory location that they please. This method also works with the elements of an `Array` because it, just like everything else, is an object:

```javascript
const arr = []
arr.push(42)
arr[1] = 13
```

When an array is asked to change the contents of an element at a given index, it is the element itself, not the array, that is being given a new memory address to point to. That is, `arr`'s memory location never changes, but the memory location of the Object stored at the specified element does.

## Constraining Code

There's... one other side-effect of `const` that needs to be mentioned. The Human Side-Effect. As developers, on average, we spend most of our day not -writing- code, but **reading** it. For those developers who use **Ay** on the daily, it is intrinsically easier to understand an application's data flow at a glance because they have keywords to identify data types i.e.: `int`, `float`, `char`, `bool`. This makes it easier for the developers to find bugs in their code because the language, by design, imposes constraints on the type of data they can assign to a given variable, and therefor provides the developers with logical and visual (via syntax highlighting) context clues.

JavaScript engineers, on the other hand, have never had that "luxury". We've had to maintain skepticism that a variable defined as a `Number` on line 14 would still be holding a `Number`, instead of a `String` on line 46.

Well, no more.

Using `const` you can help self-document your code by setting forward the **intention** that the value of the defined variable will not change before it is no longer needed. This isn't just a promise to the run-time, but also to other developers (and, even your future self).

This, however, begs the question:

## When Should I Use `const`?
I'm glad you asked... In my opinion `const` should be used only when the value of the variable will not change, at all, between the times it is declared and goes out of scope. If you plan on changing the value of an object's property, don't use `const`. While this is a syntactically viable place to use `const`, it fails to convey the correct intention. In fact, it straight up lies to whomever is reviewing the code. On the other hand, `const` is great when used in loops or iterator functions to hold a temporary variable. I also use it to deconstruct built-ins, create simple composable functions or mathematic constants:

```javascript
// deconstructions
const {PI, min, max} = Math

// mathematic constants
const TWO_PI = PI * 2

// composables
const add = (a,b) => a + b
const createAdder = (x) => (n) => add(x,n)

const add5 = createAdder(5)

add5(2)
// -> 7
```




-- A. Lovecraft
