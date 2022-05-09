




const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 500;
const HEALTH_POS_X = 10;
const HEALTH_POS_Y = 10;
const HEALTH_SIZE = 10;

var lives: number =3;
let ctx: CanvasRenderingContext2D=document.getElementById("canvas").getContext("2d")
let gameDiv=document.getElementById("gameDiv")
let canvas: HTMLElement=document.getElementById("Canvas") // RESIZECANVAS get the canvas element
window.onload=startCanvas

function startCanvas(){
	setInterval(updateCanvas, 10) // Set up the animation with an interval timer
}

function updateCanvas(){
	// Clear the scren
	ctx.fillStyle = "black"
	ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
	
	// Every frame, draw all of the lives
	// This loop will draw one red square for each life left
	let lifeCount: number = 0 // Start at the first life (counting from zero)
	while (lifeCount < lives){
		ctx.fillStyle = "red"
		ctx.fillRect(HEALTH_POS_X+lifeCount*25, HEALTH_POS_Y, HEALTH_SIZE,HEALTH_SIZE) // Draw the life, use the lifeCounter to control the position
		lifeCount++ // Move to the next life
	}
	
	// Draw the diagnostic text
}

class Vector{
	constructor(x: number,y: number){}
}

/*class Object{
    constructor(id: string,x: number,y: number ,width: number ,height: number){}

	setPosition(targetVector){
		this.x=targetVector.x;
		this.y=targetVector.y;
	}
}

class Entity extends Object{
	constructor(id: string,x: number,y: number ,width: number ,height: number){
		super();
	}
}*/
