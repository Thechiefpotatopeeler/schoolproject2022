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
            case "right": //Moves the player to the right
                this.x+=playerSpeed;
                break;
            case "left": //Moves the player to the left
                this.x-=playerSpeed;
                break;
            case "up": //Moves the player up
                this.y-=playerSpeed;
                break;
            case "down": //Moves the player down
                this.y+=playerSpeed;
                break;
        }
    }
}


//var entities = [];
var player1 = new Object("player1","player1.png",250,CANVAS_HEIGHT/2,PLAYER_SIZE,PLAYER_SIZE); //Makes the player's first object
var player2 = new Object("player2","player2.png",750,CANVAS_HEIGHT/2,PLAYER_SIZE,PLAYER_SIZE);//Makes the player's second object
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
        case "d": // Moves the player right
            player1.move("right");
            player2.move("left");
            break;
        case "a":
            player1.move("left");
            player2.move("right");
            break;
        case "w":
            player1.move("up");
            player2.move("down");
            break;
        case "s":
            player1.move("down");
            player2.move("up");
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
    player1.draw();
    player2.draw();
    //console.log(player2)
    

}


