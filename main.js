




const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 1000;
var lives =5;

function startCanvas(){
	ctx=document.getElementById("canvas").getContext("2d")
	// Set up the animation with an interval timer.
	setInterval(updateCanvas, 10)
}

function updateCanvas(){
	// Clear the scren
	ctx.fillStyle = "white"
	ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT,30)
	
	// Every frame, draw all of the lives
	// This loop will draw one red square for each life left
	lifeCount = 0 // Start at the first life (counting from zero)
	while (lifeCount < lives){
		ctx.fillStyle = "red"
		ctx.fillRect(150+lifeCount*50, 210, 30,30) // Draw the life, use the lifeCounter to control the position
		lifeCount++ // Move to the next life
	}
	
	// Draw the diagnostic text
	ctx.fillStyle="blue"
	ctx.fillText("You have "+lives+" lives left",150,270)
	ctx.fillText("Press any key to lose a life",150,290)
}

class player{
    constructor(x,y,width,height){}
}
