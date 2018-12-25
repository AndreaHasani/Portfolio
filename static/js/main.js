//// Smooth scroll
function ScrollToResolver(elem) {
  var jump = parseInt(elem.getBoundingClientRect().top * 0.2);
  document.body.scrollTop += jump;
  document.documentElement.scrollTop += jump;
  //lastjump detects anchor unreachable, also manual scrolling to cancel animation if scroll > jump
  if (!elem.lastjump || elem.lastjump > Math.abs(jump)) {
    elem.lastjump = Math.abs(jump);
    setTimeout(function() {
      ScrollToResolver(elem);
    }, "25");
  } else {
    elem.lastjump = null;
  }
}
$(".mobile-menu ul")
  .find("a")
  .forEach(function(e) {
    e.addEventListener(
      "click",
      function(event) {
        event.preventDefault();
        ScrollToResolver($($(this).attr("href"))[0]);
      },
      false
    );
  });

$("#arrow").on("click", function () {
});


/* particlesJS.load(@dom-id, @path-json, @callback (optional)); */
particlesJS.load("particles-js", "./static/assets/particles.json", function() {
  console.log("callback - particles.js config loaded");
});

//var canvas;
//var context;
//var screenH;
//var screenW;
//var stars = [];
//var fps = 60;
//var numStars = 1200;

//$('document').ready(function() {

//  // Calculate the screen size
//	screenH = $(window).height();
//	screenW = $(window).width();

//	// Get the canvas
//	canvas = $('#particles-js');

//	// Fill out the canvas
//	canvas.attr('height', screenH);
//	canvas.attr('width', screenW);
//	context = canvas[0].getContext('2d');

//	// Create all the stars
//	for(var i = 0; i < numStars; i++) {
//		var x = Math.round(Math.random() * screenW);
//		var y = Math.round(Math.random() * screenH);
//		var length = 1 + Math.random() * 1.5;
//		var opacity = Math.random();

//		// Create a new star and draw
//		var star = new Star(x, y, length, opacity);

//		// Add the the stars array
//		stars.push(star);
//	}

//	animateInterval = setInterval(animate, 2000 / fps);
//});

///**
// * Animate the canvas
// */
//function animate() {
//	context.clearRect(0, 0, screenW, screenH);
//	$.each(stars, function() {
//		this.draw(context);
//	})
//}

///* stop Animation */
//function stopAnimation()
//{
//     clearInterval(animateInterval);
//}

////stopAnimation();

//function Star(x, y, length, opacity) {
//	this.x = parseInt(x);
//	this.y = parseInt(y);
//	this.length = parseInt(length);
//	this.opacity = opacity;
//	this.factor = 1;
//	this.increment = Math.random() * .03;
//}

//Star.prototype.draw = function() {
//	context.rotate((Math.PI * 1 / 10));

//	// Save the context
//	context.save();

//	// move into the middle of the canvas, just to make room
//	context.translate(this.x, this.y);

//	// Change the opacity
//	if(this.opacity > 1) {
//		this.factor = -1;
//	}
//	else if(this.opacity <= 0) {
//		this.factor = 1;

//		this.x = Math.round(Math.random() * screenW);
//		this.y = Math.round(Math.random() * screenH);
//	}

//	this.opacity += this.increment * this.factor;

//	context.beginPath()
//    context.arc(100, 75, 1, 0, 2 * Math.PI);
//	context.closePath();
//	context.fillStyle = "rgba(255, 255, 200, " + this.opacity + ")";
//	context.shadowBlur = 5;
//	context.shadowColor = '#fff';
//	context.fill();

//	context.restore();
//}

var options = {
  loop: true,
  typeSpeed: 60,
  strings: [
    "builds websites.",
    "writes scrapers.",
    "builds bots.",
    "deploys docker containers.",
    "builds cms.",
    "writes python scripts."
  ],
  cursorChar: "",
  backSpeed: 30,
  startDelay: 250
};
var typed = new Typed("#typing", options);

//var instance = new TypeIt('#typing', {
//    strings:
//    [
//	"builds websites.",
//	"writes scrapers.",
//	"builds bots.",
//	"deploys docker containers.",
//	"builds cms.",
//	"writes python scripts.",
//    ],
//    breakLines: false,
//    speed: 85,
//deleteSpeed: 40,
//    nextStringDelay: [250, 700],
//    loop: true,
//    loopDelay: 500
//  //-- Other options...
//});
