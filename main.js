const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 500;
const HEALTH_POS_X = 10;
const HEALTH_POS_Y = 10;
const HEALTH_SIZE = 10;
const PLAYER_SIZE = 20;

var lives = 3;
var playerSpeed = 5;

class Vector {
    constructor(x, y) { }
}
class Object{
    constructor(id,image,x,y,width,height){
        this.id=id;
        this.image=image;
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;
    }

    setPosition(x,y){
        this.x=x;
        this.y=y;
    }
    draw(){//Draws the entity
        //console.log(player);
        ctx.fillRect(this.x,this.y,this.width,this.height);
    }
    move(direction){
        switch(direction){
            case "right":
                this.x+=playerSpeed;
        }
    }
}


//var entities = [];
var player = new Object("player","player.png",0,0,PLAYER_SIZE,PLAYER_SIZE); //Makes the player
//entities.push(player);


window.onload = startCanvas;
function startCanvas() {
    ctx = document.getElementById("canvas").getContext("2d");
    gameDiv = document.getElementById("gameDiv");
    canvas = document.getElementById("Canvas"); // RESIZECANVAS get the canvas element
    setInterval(updateCanvas, 10); // Set up the animation with an interval timer
}

window.addEventListener('keydown', keyDownFunction)

function keyDownFunction(keyboardEvent){
    switch(keyboardEvent.key){
        case "a": // Moves the player right
            player.move(right);
            break;
        case "d":
            player.move(left);
            break;

    }
}

function updateCanvas() {
    // Clear the scren
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    // Every frame, draw all of the lives
    // This loop will draw one red square for each life left
    let lifeCount = 0; // Start at the first life (counting from zero)
    while (lifeCount < lives) {
        ctx.fillStyle = "red";
        ctx.fillRect(HEALTH_POS_X + lifeCount * 25, HEALTH_POS_Y, HEALTH_SIZE, HEALTH_SIZE); // Draw the life, use the lifeCounter to control the position
        lifeCount++; // Move to the next life
    }

    //console.log(entities)

    /*for (let i = 0; i < entities.length; i++) {
        ctx.fillStyle = "red";
        ctx.fillRect(entities[i].x, entities[i].y, entities[i].width, entities[i].height);
    }*/
    player.draw();
    

}


