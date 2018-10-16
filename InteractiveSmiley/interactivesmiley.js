// Watchmen Smiley, with gradient and blood, and scale and rotation
// ...and keyboard-handling to move it around

"use strict";
/* jshint browser: true, devel: true, globalstrict: true */

/*
Stay within this 72 character margin, to keep your code easily readable
         1         2         3         4         5         6         7
123456789012345678901234567890123456789012345678901234567890123456789012
*/

// ======================
// IMPORTANT INSTRUCTIONS
// ======================
//
// * Submit your URL with an explicit numerical version suffix
//   (e.g. "jsfiddle.net/qWeRtY/0" denoting version 0)
//   NB: If you do not provide a suffix, the marker is allowed
//   to assume anything. In particular, they may assume 0.
//
// * Don't modify this framework except where instructed.
//   It is here to help you (and to help us when marking!)
//
// * DON'T CHEAT!


// ==========
// OBJECTIVES
// ==========
//
// * Draw a "midground" smiley at coords x=350, y=50 with radius=50
// * WASD keys should move it up/left/down/right by 10 pixels-per-event
// * OP keys should divide/multiply its radius by a factor of 1.1
// * QE keys should reduce/increase its orientation by 1/37th of a
//      revolution.
// * T should toggle a "trail" behind the moveable one.
//   HINT: Doing this is actually easier than NOT doing it!
//
// * B should toggle a background of 2 other smileys
// * F should toggle a foreground of 2 other smileys
// * One of the foreground smileys should rotate in the opposite
//   direction to the player-moveable one.
//
// * M should toggle support for moving the smiley via the mouse
//
// * The background should be on by default
// * The foreground should be on by default
// * The trail should be off by default
// * The mouse-control should be off by default
//
// NB: The trail *doesn't* have to be preserved across F and B toggles
//     Typically, either of these toggles will have the side-effect of
//     erasing the current trail.
//
//     The drawBackground and drawForeground functions have been
//     provided for you, but you'll have to modify the foreground one
//     to implement the counter-rotation feature.


// ============
// UGLY GLOBALS
// ============
//
// Regrettable, but they just make things easier.
//
var g_canvas = document.getElementById("myCanvas");
var g_ctx = g_canvas.getContext("2d");
var g_keys = [];


// ================
// HELPER FUNCTIONS
// ================

function clear() {
    g_ctx.clearRect(0, 0, g_canvas.width, g_canvas.height);
}

function drawBackground() {
    drawDefaultSmiley(g_ctx);
    drawSmileyAt(g_ctx,  25, 375,  25, -Math.PI/8);
}

function drawForeground(angle) {
    drawSmileyAt(g_ctx,  25, 375,  25, Math.PI/8);
    
    // TODO: Make this one rotate in the opposite direction
    //       to your player-controllable one.
    drawSmileyAt(g_ctx, 300, 300, 100, 2*Math.PI - angle);
}

function fillEllipse(ctx, cx, cy, halfWidth, halfHeight, angle) {
    ctx.save(); // save the current ctx state, to restore later
    ctx.beginPath();
    
    // These "matrix ops" are applied in last-to-first order
    // ..which can seem a bit weird, but actually makes sense
    //
    // After modifying the ctx state like this, it's important
    // to restore it
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.scale(halfWidth, halfHeight);
    
    // Just draw a unit circle, and let the matrices do the rest!
    ctx.arc(0, 0, 1, 0, Math.PI*2);
    ctx.fill();
    
    ctx.restore();
}


// =================
// MATRIX CLEVERNESS
// =================

function drawSmileyAt(ctx, cx, cy, radius, angle) {
    // This matrix trickery lets me take a "default smiley",
    // and transform it so I can draw it anyway, at any size,
    // and at any angle.
    //
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    var scale = radius / g_defaultSmileyRadius;
    ctx.scale(scale, scale);
    ctx.translate(-g_defaultSmileyX, -g_defaultSmileyY);
    drawDefaultSmiley(ctx);
    ctx.restore();
}


// =================
// OUR SMILEY OBJECT
// =================

// Let's make the user-controllable smiley into a simple
// little javascript object. (Global for "convenience").
//
var g_smiley = {
    x : 350,
    y :  50,
    
    radius : 50,
    angle  : 0,
    trail : false,
    hasBackground : true,
    hasForeground : true,
    mouseActive : false
    
};

// Let's add a draw method...
//
// (We could have done that above, but I find that it's sometimes
// cleaner to add the functions separately, to reduce indentation.)
//
g_smiley.draw = function() {
		if (!this.trail) {
    		clear();
    }
    if (this.hasBackground && !this.trail) {
    		drawBackground();
    }
    if (this.hasForeground) {
    		drawForeground(this.angle);
    }
    drawSmileyAt(g_ctx, 
                 this.x, this.y, 
                 this.radius, this.angle);
};

// You *might* want to add other methods here, as part of your
// implementation.. or you could just manipulate the object
// state directly from inside other (non-member) functions.
//
// On a small project like this, direct manipulation is fine,
// and might be simpler. On a larger project, you would be
// more likely to do everything via "methods" i.e. functions
// which belong to the object itself.


// ======================
// DEFAULT SMILEY DRAWING
// ======================

var g_defaultSmileyX = 200,
    g_defaultSmileyY = 200,
    g_defaultSmileyRadius = 150;

// A crappy placeholder smiley implementation.
function drawDefaultSmiley(ctx) {
    ctx.save();

    // abbreviation variables
    var cx = g_defaultSmileyX,
        cy = g_defaultSmileyY,
        r  = g_defaultSmileyRadius;
    
    // face
    ctx.fillStyle = "yellow";
    fillEllipse(ctx, cx, cy, r, r, 0);
    
    // border
    strokeArc(ctx, cx, cy, r, 0, Math.PI * 2, "black");
    
    // weird HAL-like cyclops eye!
    ctx.fillStyle = "black";
    fillEllipse(ctx, cx, cy - r/3, r/3, r/3, 0);
    ctx.fillStyle = "red";
    fillEllipse(ctx, cx, cy - r/3, r/4, r/4, 0);
    
    // mouth
    var smileAngle = Math.PI * 0.7,
        smileAngleOffset = (Math.PI - smileAngle) /2,
        smileAngleStart = smileAngleOffset,
        smileAngleEnd = Math.PI - smileAngleOffset,
        smileRadius = r * 2/3;
    ctx.lineWidth = r / 20;
    strokeArc(ctx, cx, cy, smileRadius,
              smileAngleStart, smileAngleEnd, "black");
    
    ctx.restore();
}

function strokeArc(ctx, x, y, radius, startAngle, endAngle)
{
    ctx.beginPath();
    ctx.arc(x, y, radius, startAngle, endAngle);
    ctx.stroke();
}


// =====================================================
// YOUR VERSION OF drawDefaultSmiley(ctx) SHOULD GO HERE
// =====================================================
//
// Your version will replace my placeholder implementation.
//
// If you didn't complete the previous homework, then just
// use my crappy placeholder.
//
function drawDefaultSmiley(ctx) {
		ctx.beginPath();
    //Draw bounding circle
    fillCircle(ctx,g_defaultSmileyX, g_defaultSmileyY, g_defaultSmileyRadius);
    
    drawEyes(ctx);
    drawDimples(ctx);
    drawSmile(ctx);
    drawBlood(ctx);
}

function fillCircle(ctx, cx, cy, radius){
    //Make the circle slightly gradient
    var gradient = ctx.createRadialGradient(150, 150, 20, cx, cy, 160);
    gradient.addColorStop(0, '#ffffcc');
    gradient.addColorStop(0.8,'#ffd700');
		gradient.addColorStop(1, '#ffac1a');
		ctx.fillStyle = gradient;
    ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
    
    ctx.fill();
    //Draw a thin black outline
    ctx.strokeStyle = 'black';
    ctx.stroke(); 
}

function drawSmile(ctx) {
    //Draw smile
    ctx.beginPath();
    ctx.arc(200, 190, 100, 0.2*Math.PI, 0.8*Math.PI);
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'black';
    ctx.stroke();
		//Make smile slightly thicker at the bottom
    ctx.beginPath();
    ctx.arc(200, 202, 92, 0.17*Math.PI, 0.83*Math.PI);
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'black';
    ctx.stroke();
}

function drawDimples(ctx) {
    fillEllipse(ctx, 120, 250, 3, 13, 0.85);
    fillEllipse(ctx, 280, 250, 3, 13, 2.25);
}

function drawEyes(ctx) {
    ctx.fillStyle = "black";
    fillEllipse(ctx, 150, 150, 8.5, 35, 0);
    fillEllipse(ctx, 250, 150, 8.5, 35, 0);
}

function drawBlood(ctx) {
     //Begin custom shape
    ctx.beginPath();
    ctx.moveTo(88, 123);
  	ctx.bezierCurveTo(78, 102, 95, 103, 103, 112);
  	ctx.bezierCurveTo(113, 123, 135, 128, 135, 133);
 	  ctx.bezierCurveTo(135, 140, 129, 132, 120, 131);
  	ctx.bezierCurveTo(106, 129, 199, 210, 195, 222);
  	ctx.bezierCurveTo(190, 236, 110, 123, 109, 138);
  	ctx.bezierCurveTo(108, 151, 129, 169, 118, 170);
  	ctx.bezierCurveTo(107, 171, 104, 127, 100, 137);
  	ctx.bezierCurveTo(97, 144, 104, 155, 97, 158);
  	ctx.bezierCurveTo(91, 161, 94, 130, 88, 123);

      //Complete custom shape
      ctx.closePath();
      ctx.lineWidth = 1;
      ctx.fillStyle = 'red';
      ctx.fill();
      ctx.strokeStyle = 'black';
      ctx.stroke();   
      
      //Draw white spots to imitate shadows 
      ctx.fillStyle = 'white';
      fillEllipse(ctx, 89, 118, 4, 1.5, 1.1);
      fillEllipse(ctx, 98, 123, 1.5, 1.5, 0);
      fillEllipse(ctx, 112, 160, 2.5, 1.5, 1.1);
      fillEllipse(ctx, 180, 210, 4, 1.5, 0.8);
}



// ======
// REDRAW
// ======
//
// Your code should call this when needed, to update the
// screen. You'll have to edit this routine to make it do
// everything that is required (e.g. background, foreground,
// dealing with the "trail" etc).
//
function redraw() {
	g_keys.map((item) => {
  	if (item !== false) {
    	switch (item) {
        case KEY_W : g_smiley.y -= 10; break;
        case KEY_A : g_smiley.x -= 10; break;
        case KEY_S : g_smiley.y += 10; break;
        case KEY_D : g_smiley.x += 10; break;
        
        case KEY_B : g_smiley.hasBackground = !g_smiley.hasBackground; break;
        case KEY_F : g_smiley.hasForeground = !g_smiley.hasForeground; break;
        
        case KEY_T : g_smiley.trail = !g_smiley.trail; break;
        case KEY_M : {
          if (g_smiley.mouseActive)
          	window.removeEventListener('mousemove', handleMouseMove);
          else
            window.addEventListener('mousemove', handleMouseMove);
          g_smiley.mouseActive = !g_smiley.mouseActive;
          break;
        }

        case KEY_O : g_smiley.radius /= 1.1; break;
        case KEY_P : g_smiley.radius *= 1.1; break;

        case KEY_Q : g_smiley.angle -= (1/37) * 2*Math.PI; break;
        case KEY_E : g_smiley.angle += (1/37) * 2*Math.PI; break;
      }
    }
  }); 
    g_smiley.draw();
}

redraw();
initKeyboardHandlers();
// ========================================
// YOUR EVENT-HANDLING STUFF SHOULD GO HERE
// ========================================

var KEY_W = 'W'.charCodeAt(0);
var KEY_A = 'A'.charCodeAt(0);
var KEY_S = 'S'.charCodeAt(0);
var KEY_D = 'D'.charCodeAt(0);

var KEY_B = 'B'.charCodeAt(0);
var KEY_F = 'F'.charCodeAt(0);

var KEY_T = 'T'.charCodeAt(0);
var KEY_M = 'M'.charCodeAt(0);

var KEY_O = 'O'.charCodeAt(0);
var KEY_P = 'P'.charCodeAt(0);

var KEY_Q = 'Q'.charCodeAt(0);
var KEY_E = 'E'.charCodeAt(0);

// Handles when the key is up
function handleKeyup(evt) {
  g_keys[evt.keyCode] = false;
  redraw();
}

// Handles when the key is down
function handleKeydown(evt) {
	g_keys[evt.keyCode] = evt.keyCode;
  redraw();
}

// Handles mouse moves and drawing
function handleMouseMove(evt) {
    g_smiley.x = evt.clientX - g_canvas.offsetLeft;
    g_smiley.y = evt.clientY - g_canvas.offsetTop;
    g_smiley.draw();
}


function initKeyboardHandlers() {
    window.addEventListener("keydown", handleKeydown);
    window.addEventListener("keyup", handleKeyup);
}

function initMouseHandlers() {
    window.addEventListener("mousemove", handleMouseMove);
}