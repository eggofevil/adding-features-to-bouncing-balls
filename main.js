// setup canvas
var para = document.querySelector('p');
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight; 

// function to generate random number

function random(min,max) {
  var num = Math.floor(Math.random()*(max-min)) + min;
  return num;
}

function Shape(x, y, velX, velY, exists) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.exists = exists;
}

Shape.prototype.draw = function() {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
}

Shape.prototype.update = function() {
  if((this.x + this.size) >= width) {
    this.velX = -(this.velX);
  }
  if((this.x - this.size) <= 0) {
    this.velX = -(this.velX);
  }
  if((this.y + this.size) >= height) {
    this.velY = -(this.velY);
  }
  if((this.y - this.size) <= 0) {
    this.velY = -(this.velY);
  }
  this.x += this.velX;
  this.y += this.velY;
}

Shape.prototype.collisionDetect = function() {
  for (var j = 0; j < balls.length; j++) {
    if(!(this === balls[j])) {
      var dx = this.x - balls[j].x;
      var dy = this.y - balls[j].y;
      var distance = Math.sqrt(dx * dx + dy * dy);
      
      if(distance < this.size + balls[j].size) {
        balls[j].color = this.color = 'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) + ')';
      }
    }
  }
}

function EvilCircle(x, y) {
  Shape.call(this, x, y);
  this.color = "white";
  this.size = 10;
  this.velX = 20;
  this.velY = 20;
  this.exists = true;
}

EvilCircle.prototype = Object.create(Shape.prototype);
EvilCircle.prototype.constructor = EvilCircle;

EvilCircle.prototype.draw = function() {
  ctx.beginPath();
  ctx.lineWidth = 5;
  ctx.strokeStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.stroke();
}

EvilCircle.prototype.update = function() {
  if((this.x + this.size) >= width) {
    this.x = width - this.size;
  }
  if((this.x - this.size) <= 0) {
    this.x = 0 + this.size;
  }
  if((this.y + this.size) >= height) {
    this.y = height - this.size;
  }
  if((this.y - this.size) <= 0) {
    this.y = 0 + this.size;
  }
}
EvilCircle.prototype.setControls = function() {
  var _this = this;
  window.onkeydown = function(e) {
    /*if (e.keyCode === 65) {
      _this.x -= _this.velX;
    } else if (e.keyCode === 68) {
      _this.x += _this.velX;
    } else if (e.keyCode === 87) {
      _this.y -= _this.velY;
    } else if (e.keyCode === 83) {
      _this.y += _this.velY;
    }*/
    
    switch(e.keyCode) {
      case 65:
        _this.x -= _this.velX;
        break;
      case 68:
        _this.x += _this.velX;
        break;
      case 87:
        _this.y -= _this.velY;
        break;
      case 83:
        _this.y += _this.velY;
        break;
    }
  }
}

EvilCircle.prototype.collisionDetect = function() {
   for (var j = 0; j < balls.length; j++) {
    if(balls[j].exists) {
      var dx = this.x - balls[j].x;
      var dy = this.y - balls[j].y;
      var distance = Math.sqrt(dx * dx + dy * dy);
      
      if(distance < (this.size + balls[j].size)) {
        balls[j].exists = false;
      }
    }
  }
}

function Ball(x, y, velX, velY, color, size, exists) {
  Shape.call(this, x, y, velX, velY, exists);
  /*this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;*/
  this.color = color;
  this.size = size;
}

Ball.prototype = Object.create(Shape.prototype);
Ball.prototype.constructor = Ball;


var balls = [];

var evilCircle = new EvilCircle(50,50);
evilCircle.setControls();

function loop() {
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(0,0,width,height);
  while (balls.length < 25) {
    var ball = new Ball(
    random(0,width),random(0,height), random(-7, 7), random(-7,7),
      'rgb('
        + random(0,255) + ',' + random(0,255) + ',' + random(0,255) + 
      ')', + random(10,20), true);
    balls.push(ball);
  }
  var count = 0;
  for(var i = 0; i < balls.length; i++) {
    if(balls[i].exists) {
      count +=1;
      balls[i].draw();
      balls[i].update();
      balls[i].collisionDetect();
    }
  }
  para.textContent = "The number of balls on screen is " + count;
  evilCircle.draw();
  evilCircle.update();
  evilCircle.collisionDetect();
  requestAnimationFrame(loop);
}

loop();

