"use strict";
/* jshint browser: true, devel: true, globalstrict: true */

/*
Stay within this 72 character margin, to keep your code easily readable
         1         2         3         4         5         6         7
123456789012345678901234567890123456789012345678901234567890123456789012
*/

// It's up to you whether to take advantage of these variables.
var g_defaultSmileyX = 200,
    g_defaultSmileyY = 200,
    g_defaultSmileyRadius = 150;

// =======================
// YOUR STUFF GOES HERE...
// =======================

// Replace my place-holder implementation of `drawDefaultSmiley` with your own.
// Use the same function name though (this will be important later).
//
function drawDefaultSmiley(ctx) {
		//Draw bounding circle
    fillCircle(ctx,g_defaultSmileyX, g_defaultSmileyY, g_defaultSmileyRadius);
    
    drawEyes(ctx);
    drawDimples(ctx);
    drawSmile(ctx);
    drawBlood(ctx);
}


// =============
// TEST "DRIVER"
// =============

function draw() { 
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");

    drawDefaultSmiley(ctx);
}

draw();


// ================
// HELPER FUNCTIONS
// ================

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
    
    ctx.beginPath(); // reset to an empty path
    ctx.restore();
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