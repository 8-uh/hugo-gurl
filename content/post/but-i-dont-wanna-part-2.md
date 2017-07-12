+++
title = "But I Don't Wanna: Part 2 [WIP]"
description = ""
tags = ["x"]
categories = ["y"]
date = "2017-07-12T03:18:11-05:00"
+++


# Part Two: Mmmm... Delicious

Jumping right in from where we left off from [Part One](https://8-uh.github.io/post/but-i-dont-wanna-part-1/), we're gonna dive straight into:

## Classes
*"Why start there?"*, you might be asking. The truth is, proper use of classes in es6 will allow us to slowly step into new concepts using a familiar framework. Here... lemme show you:

**A Classic Example of a JavaScript class**  
Here's an example of an ES5 class implemented in the most correct way (with interspersings of `p5.js` so as to not have to create an entirely demonstrable API):

```js
var Circle = function(x, y, radius, color) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  // ES5 method of implementing defaults
  this.color = color || '#ff0000';
};

Circle.prototype.render = function() {
  push();
  translate(this.x, this.y);
  noStroke();
  fill(this.color);
  ellipse(0, 0, this.radius, this.radius);
  pop();
}
```

To use this class, somewhere in your main code, you'd maybe write:

```js
var redCircle, greenCircle;

function setup() {
  //.. other setup stuff ..//
  redCircle = new Circle(100, 100, 50);
  greenCircle = new Circle(200, 200, 30, '#00ff00');
}

function draw() {
  redCircle.draw();
  greenCircle.draw();
}
```

That seems simple enough, right? But let's go a step further and say that, after drawing red and green circles on the canvas for a while, you wanted to add a moving circle. One that bounces around the screen. The first option is to create a new circle, and then update its position every frame and check for bounding areas, like so:

```js
var redCircle,
    greenCircle,
    movingCircle,
    movingCircleSpeed = 5, // move 5 pixels in both the x and axis every frame
    movingCircleDirectionX = 1,
    movingCircleDirectionY = 1;


function setup() {
  //.. other setup stuff ..//
  redCircle = new Circle(100, 100, 50);
  greenCircle = new Circle(200, 200, 30, '#00ff00');
  movingCircle = new Circle(50, 50, 25, '#333');
}

function draw() {
  redCircle.render();
  greenCircle.render();
  // update movingCircle's position
  movingCircle.x += movingCircleSpeed * movingCircleDirectionX;
  movingCircle.Y += movingCircleSpeed * movingCircleDirectionY;
  // check for x-boundaries and reverse direction
  if(movingCircle.x + movingCircle.radius >= width ||
  movingCircle.x - movingCircle.radius <= 0) {
    movingCircleDirectionX *= -1;
  }
  // check for y-boundaries and reverse direction
  if(movingCircle.y + movingCircle.radius >= height ||
  movingCircle.y - movingCircle.radius <= 0) {
    movingCircleDirectionY *= -1;
  }
  movingCircle.render();
}
```
That's not too bad and it's kinda neat... But, you get to thinking, *"Hey... it'd be neat to have a bunch of these circles bouncing around the screen while others have static position. I want each circle to bounce off the sides of the screen a few times, each time getting bigger, and then explode into a bunch of a little circles that end up doing the same thing. But to do that, I'd need a whole bunch of global variables and it'd be really difficult to keep track of all of that...".*

One possible solution would be to create a *sub*-class that **inherits** from `Circle` and, because you want a bunch of circles, you decide to follow common practice and use an Object Pool to manage them. That way you can have ExplodingCircles and static Circles. Here's what that would look like (re-including the base `Circle` class):

```js
var Circle = function(x, y, radius, color) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  // ES5 method of implementing defaults
  this.color = color || '#ff0000';
};

Circle.prototype.render = function() {
  push();
  translate(this.x, this.y);
  noStroke();
  fill(this.color);
  ellipse(0, 0, this.radius, this.radius);
  pop();
}

var ExplodingCircle = function(x, y, radius, color, maxBounces, velocityX, velocitY) {
  Circle.call(this, x, y, radius, color);
  this.maxBounces = maxBounces;
  this.totalBounces = 0;
  this.velocityX = velocityX;
  this.velocityY = velocityY;
  this.events = new EventEmitter(); // a class that emits events and handles callbacks
  this.alive = true;
}

ExplodingCircle.prototype = Object.create(Circle.prototype);
ExplodingCircle.prototype.constructor = ExplodingCircle;

ExplodingCircle.prototype.update = function() {
  // Naive Euler Integration
  this.x += this.velocityX
  this.y += this.velocityY
  // check for boundary collisions and reverse direction
  this.checkCollisions()
}

ExplodingCircle.prototype.checkCollisions = function () {
  if(this.x + this.radius >= width ||  this.x - this.radius <= 0) {
    this.velocityX *= -1
    this.bounce()
  }
  if(this.y + this.radius >= height || this.y - this.radius <= 0) {
    this.velocityY *= -1
    this.bounce()
  }
}

ExplodingCircle.prototype.bounce = function() {
  this.totalBounces++;
  this.radius *= 1.25;
  if(this.totalBounces === this.maxBounces) {
    this.alive = false
    this.events.emit('onKilled', this);
  }
}

ExplodingCircle.prototype.reset = function(x, y, radius, color, maxBounces, velocityX, velocitY) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.color = color;
  this.maxBounces = maxBounces;
  this.velocityX = velocityX;
  this.velocityY = velocityY;
  this.alive = true;
}
// No need to implement the `draw` method as the parent class does that already

// A simple ObjectPool to manage circles
var ExplodingCircleManager = function(maxCircles) {
  this.circles = []
  this.maxCircles = maxCircles
}

ExplodingCircleManager.prototype.createCircle = function(x, y, radius, color, maxBounces, velocityX, velocitY) {
  if(this.circles.length < this.maxCircles) {
    var circle = new ExplodingCircle(x, y, radius, color, maxBounces, velocityX, velocityY);
    circle.events.addEventListener('onKilled', this.onCircleKilled.bind(this));
    this.circles.push(circle);
    return circle;
  }
  return null;
}
ExplodingCircleManager.prototype.update = function() {
  for(var i = 0, len = this.circles.length; i < len; i++) {
    var circle = this.circles[i];
    if(circle.alive === true) {
      circle.update();
    }
  }
}

ExplodingCircleManager.prototype.render = function() {
  for(var i = 0, len = this.circles.length; i < len; i++) {
    var circle = this.circles[i];
    if(circle.alive === true) {
      circle.render();
    }
  }
}
ExplodingCircleManager.prototype.spawn = function(x, y, directionX, directionY) {
  var radius = random(5, 20);
  var x = random(radius, width - radius);
  var y = random(radius, height - radius);
  var color = random();
  var maxBounces = ceil(random(3,10));
  var velocityX = random(1, 5) * directionX;
  var velocityY = random(1, 5) * directionY;
  var deadCircle = null;
  var i = 0;
  do {
    if(this.circles[i].alive === false) {
      deadCircle = this.circles[i];
    }
  } while(deadCircle == null && i < this.circles.length)

  if(deadCircle !== null) {
    deadCircle.reset(x, y, radius, color, velocityX, velocityY);
  } else {
    this.createCircle(x, y, radius, color, velocityX, velocityY);
  }
}

ExplodingCircleManager.prototype.onCircleKilled = function(circle) {
  var numCirclesToSpawn = random(2,5);
  var angleToCenter = Math.atan2(circle.y, circle.x) - Math.atan2(height * 0.5, width * 0.5);
  var spread = random(0, Math.PI);
  var angleStep = spread / numCirclesToSpawn + 1;
  for(var theta = angleStep; theta < spread; theta += anglStep) {
    var directionX = sign(sin(theta));
    var directionY = sign(cos(theta));
    this.spawn(circle.x, circle.y, directionX, directionY);
  }
}


var circleManger;
function setup() {
  circleManager = new ExplodingCircleManager(50);
  for(var i = 0; i < 5; i++) {
    var radius = random(5, 20);
    var x = random(radius, width - radius);
    var y = random(radius, height - radius);
    var color = random(['#ff0000', '#00ff00', '#0000ff', '#ff00ff', '#00ffff','#ffff00']);
    var maxBounces = ceil(random(3,10));
    var velocityX = random(-5, 5);
    var velocityY = random(-5, 5);
    circleManager.create(x, y, radius, color, maxBounces, velocityX, velocityY);
  }
}

function draw() {
  circleManager.update();
  circleManager.render();
}
```
Now, I'm not 100% certain this code works, as this is a rough draft.... But 5 circles should be created that bounce around the screen, and each time they bounce their radius gets bigger... until they each explode, creating 2 - 5 more circles that bounce around and do the same thing, until there are 50 circles bouncing and exploding on screen.

That was the procedural-ES5 way to do it... Now, I present to you, the functional-ES6 way to write it. I'll explain each concept after the code:

```js
const {random, floor, PI, sign, sin, cos} = Math
const colors = ['#ff0000', '#00ff00', '#0000ff', '#ff00ff', '#00ffff','#ffff00']
const rrange = (start, end) => ceil(random() * (end - start)) + start
const angleBetween = (x1, y1, x2, y2) => Math.atan2(y2 - y1, x2 - x1)

const randomColor = _ => colors[floor(random() * colors.length)]

class Circle {
  constructor(x, y, radius, color='#ff0000') {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
  }
  render() {
    const {x, y, radius, color} = this
    push()
      translate(x, y)
      fill(color)
      ellipse(0, 0, radius, radius)
    pop()
  }
}

class ExplodingCircle extends Circle {

  constructor(x, y, radius, color, maxBounces, velocityX, velocityY) {
    super(x, y, radius, color)
    this.maxBounces = maxBounces
    this.totalBounces = 0
    this.velocityX = velocityX
    this.velocityY = velocityY
    this.alive = true
    this.events = new EventEmitter()
  }
  update() {
    const {velocityX: vx, velocityY: vy} = this
    this.x += vx
    this.y += vy
    this.checkCollisions()
  }

  checkCollision() {
    const {x, y, radius : r} = this
    const tests = [
      x + r >= width,
      x - r <= 0,
      y + r >= height,
      y - r <= 0
    ]
    if(tests.some(test => test)) {
      const [a,b, ...c] = tests

      if([a,b].some(test => test))
        this.velocityX *= -1

      if(c.some(test => test))
        this.velocityY *= -1

      this.bounce()
    }
  }

  bounce() {
    this.totalBounces++
    this.radius *= 1.25
    if(this.totalBounces === this.maxBounces) {
      this.alive = false
      this.events.emit('onKilled', this)
    }
  }
  reset(x, y, radius, color, maxBounces, velocityX, velocityY) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.maxBounces = maxBounces;
    this.velocityX = velocityX;
    this.velocityY = velocityY;
    this.alive = true;
  }
}

class ExplodingCircleManager {
  constructor(maxCircles) {
    this.circles = []
    this.maxCircles = maxCircles
  }

  createCircle(x, y, radius, color, maxBounces, velocityX, velocityY) {
    const {circles, maxCircles} = this
    if(circles.length < maxCircles) {
      const circle = new ExplodingCircle(x, y, radius, color, maxBounces, velocityX, velocityY)
      circle.events.addEventListener('onKilled', c => this.onCircleKilled(c))
      circles.push(circle)
      return circle
    }
  }

  forEachAlive(fn) {
    this.circles
      .filter(circle => circle.alive)
      .forEach(fn)
  }

  update() {
    this.forEachAlive(circle => circle.update())
  }

  render() {
    this.forEachAlive(circle => circle.render())
  }

  spawn(x, y, directX, directionY) {
    const radius = rrange(5, 20)
    const x = rrange(radius, width - radius)
    const y = rrange(radius, height - radius)
    const color = randomColor()
    const maxBounces = rrange(3, 10)
    const velocityX = directionX * rrange(1, 5)
    const velocityY = direcitonY * rrange(1, 5)
    const firstDead = this.circles.find(c => !c.alive)
    if(firstDead) {
      firstDead.reset(x, y, radius, color, velocityX, velocityY)
    } else {
      this.createCircle(x, y, radius, color, velocityX, velocityY)
    }
  }

  onCircleKilled(circle) {
    const count = rrange(2,5)
    const theta = angleBetween(circle.y, circle.x, height * 0.5, width * 0.5)
    const spread = random() * PI
    const step = spread / count + 1
    [...Array(count).keys()]
      .map(i => theta + step * (i+1))
      .forEach(t => this.spawn(
        circle.x,
        circle.y,
        sign(sin(t)),
        sign(cos(t))
      ))
  }
}
```
