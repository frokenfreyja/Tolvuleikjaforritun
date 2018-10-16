// A storage for powerups
var g_brickPowerups = [
                        {
                          name : 'increaseVel',
                          color : '#66FF66',
                          powerup : function() {
                              g_ball.xVel *= 1.2;2
                              g_ball.yVel *= 1.2;
                          }
                        },
                        {
                          name : 'decreaseVel',
                          color : '#FD0E35',
                          powerup : function() {
                              g_ball.xVel *= 0.8;
                              g_ball.yVel *= 0.8;
                          }
                        },
                        {
                          name : 'freeLife',
                          color : 'white',
                          powerup : function() {
                            g_paddle.life++;
                          }
                        },
                        {
                          name : 'increasePaddleSize',
                          color : '#FFFF31',
                          powerup : function() {
                            if (g_paddle.halfWidth + 20 <= 160) {
                              g_paddle.halfWidth += 20;
                            }
                          }
                        },
                        {
                          name : 'decreasePaddleSize',
                          color : '#0048BA',
                          powerup : function() {
                            if (g_paddle.halfWidth - 20 >= 20) {
                              g_paddle.halfWidth -= 20;
                            }
                          }
                        },
                        {
                          name : 'superman',
                          color : '#FF9933',
                          powerup : function() {
                              g_ball.isSuperman = true;
                              countDown(6);
                              setTimeout(function() {
                                g_ball.isSuperman = false;
                              }, 6000);
                          }
                        }
                       ];

var g_activePowerups = [];

// A generic constructor which accepts an arbitrary descriptor object
function Powerup(descr, powerup) {
    for (var property in descr) {
        this[property] = descr[property];
    }
    for (var property in powerup) {
        this[property] = powerup[property];
    }
}

// Find the responding powerup by color
function g_findPowerup(color) {
  for (var i = 0; i < g_brickPowerups.length; i++) {
    if (g_brickPowerups[i].color === color) {
      return g_brickPowerups[i];
    }
  }
  return null;
}

// Count down function
function countDown(i) {
  var int = setInterval(function () {
      
      document.getElementById("message").innerHTML = "Superman effect: " + i + "s";
      i-- || clearInterval(int);  //if i is 0, then stop the interval
  }, 1000);
}
// Add these properties to the prototype, where they will server as
// shared defaults, in the absence of an instance-specific overrides.
Powerup.prototype.radius = 8;

Powerup.prototype.update = function() {
  this.cy += 3;
  if (this.collidesWithPaddle()) {
    powerUp.play();
    this.powerup();
    var index = g_activePowerups.indexOf(this);
    g_activePowerups.splice(index, 1);
  }
}

Powerup.prototype.render = function (ctx) {
  ctx.fillStyle = this.color;
  fillCircle(ctx, this.cx, this.cy, this.radius);
  ctx.fillStyle = "black"
}

Powerup.prototype.collidesWithPaddle = function () {
    var r = this.radius;
    var leftBoundX = g_paddle.cx - g_paddle.halfWidth;
    var rightBoundX = g_paddle.cx + g_paddle.halfWidth;
    var upperBoundY = g_paddle.cy - g_paddle.halfHeight;
    var lowerBoundY = g_paddle.cy + g_paddle.halfHeight;

    var intersectX = this.cx + r >= leftBoundX && this.cx - r <= rightBoundX;
    var intersectY = this.cy + r >= upperBoundY && this.cy - r <= lowerBoundY;

    return intersectX && intersectY;
};