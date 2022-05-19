/*var http = require('http');

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
}).listen(8080);*/

const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 500;
const HEALTH_POS_X = 10;
const HEALTH_POS_Y = 10;
const HEALTH_SIZE = 10;
const PLAYER_SIZE = 16;
const PLAYER_1_IMAGE = new Image();
const PLAYER_2_IMAGE = new Image();
const MAX_ATTACK_POWER = 100;
PLAYER_1_IMAGE.src = "images/player1.png";
PLAYER_2_IMAGE.src = "images/player2.png";

var lives = 3;
var playerSpeed = 1.25;
var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;
var attackPressed = false;
var beamSize = 5;
var attackPower = 100;
var backUpAttack = 100;
class Object{
    constructor(id,image,x,y,width,height){//Constructor for the entity, had the identifier, texture, coordinates, and size
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
        //ctx.fillRect(this.x,this.y,this.width,this.height);
        ctx.drawImage(this.image,this.x,this.y,this.width,this.height);
    }
    move(direction, speed){
        switch(direction){
            case "right": //Moves the player to the right
                this.x+=speed;
                break;
            case "left": //Moves the player to the left
                this.x-=speed;
                break;
            case "up": //Moves the player up
                this.y-=speed;
                break;
            case "down": //Moves the player down
                this.y+=speed;
                break;
        }
    }
}


//var entities = [];
var player1 = new Object("player1",PLAYER_1_IMAGE,(CANVAS_WIDTH/4)-PLAYER_SIZE,CANVAS_HEIGHT/2,PLAYER_SIZE,PLAYER_SIZE); //Makes the player's first object
var player2 = new Object("player2",PLAYER_2_IMAGE,3*(CANVAS_WIDTH/4),CANVAS_HEIGHT/2,PLAYER_SIZE,PLAYER_SIZE);//Makes the player's second object
//entities.push(player);

function getPlayerDistance(){
    return Math.sqrt(Math.pow(player1.x-player2.x,2)+Math.pow(player1.y-player2.y,2)); //This uses the pythagoras theorem to find the distance between the two players
}
function playerAttack(){
    ctx.beginPath();//Starts the path
    ctx.lineWidth = beamSize
    if(player1.x < player2.x){
        ctx.moveTo(player1.x + PLAYER_SIZE/2,player1.y + PLAYER_SIZE/2);//Moves the path to the player's position
        ctx.lineTo(player2.x+PLAYER_SIZE/2,player2.y+PLAYER_SIZE/2);//Draws a line to the player's position
    } else if(player1.x > player2.x){
        ctx.moveTo(player1.x+PLAYER_SIZE/2, player1.y+PLAYER_SIZE/2)
        ctx.lineTo(player2.x+PLAYER_SIZE/2, player2.y+PLAYER_SIZE/2)
    }
    ctx.strokeStyle = "white";//Sets the color to red
    ctx.stroke();//Fills the line
    attackPower--;//Reduces the attack power
}
function damagePlayer(){
    ctx.fillStyle = "white"; // Set the color to white
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);//Makes a flash of white
    player1.setPosition(CANVAS_WIDTH/4,CANVAS_HEIGHT/2);//Resets the player's position
    player2.setPosition(3*(CANVAS_WIDTH/4),CANVAS_HEIGHT/2);//Resets the player's position
    lives--;//Removes a life
}

window.addEventListener('keydown', keyDown)
window.onload = startCanvas;
function startCanvas() {
    ctx = document.getElementById("canvas").getContext("2d");
    gameDiv = document.getElementById("gameDiv");
    canvas = document.getElementById("Canvas"); // RESIZECANVAS get the canvas element
    setInterval(updateCanvas, 10); // Set up the animation with an interval timer
}

function keyDown(keyboardEvent){
    switch(keyboardEvent.key){
        case "d": // Moves the player right
            rightPressed = true;
            break;
        case "a": //Moves the player lfeft
            leftPressed = true;
            break;
        case "w": //Moves the player up
            upPressed = true;
            break;
        case "s"://Moves the player down
            downPressed = true;
            break;
        case " "://Attacks
            if(attackPower >0){
                attackPressed = true;
            }
            break;
    }
}

window.addEventListener('keyup', keyUp)

function keyUp(keyboardEvent){
    switch(keyboardEvent.key){
        case "d": //Ends rigth movement
            rightPressed = false;
            break;
        case "a"://Ends left movemet
            leftPressed = false;
            break;
        case "w"://Ends up movement
            upPressed = false;
            break;
        case "s"://Ends down movement
            downPressed = false;
            break;
        case " "://Ends attack
            attackPressed = false;
            break;
    }
}

function updateCanvas() {
    // Clear the scren
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    // Every frame, draw all of the lives
    // This loop will draw one red square for each life left
    for(lifeCount = 0; lifeCount < lives; lifeCount++) {
        ctx.fillStyle = (lifeCount < 3) ? "red" : "blue";
        ctx.fillRect(HEALTH_POS_X + lifeCount * 25, HEALTH_POS_Y, HEALTH_SIZE, HEALTH_SIZE); // Draw the life, use the lifeCounter to control the position; // Move to the next life
    }
    if(getPlayerDistance()<20){
        damagePlayer();
    } else if(player1.x<0||player1.x>CANVAS_WIDTH-PLAYER_SIZE||player1.y<0||player1.y>CANVAS_HEIGHT-PLAYER_SIZE){
        damagePlayer();
    }
    //This is where the movement and attack are actually executed
    if(rightPressed == true){
        player1.move("right",playerSpeed);
        player2.move("left",playerSpeed);
    }
    if(leftPressed == true){
        player1.move("left",playerSpeed);
        player2.move("right",playerSpeed);
    }
    if(upPressed == true){
        player1.move("up",playerSpeed);
        player2.move("down",playerSpeed);
    }
    if(downPressed == true){
        player1.move("down",playerSpeed);
        player2.move("up",playerSpeed);
    }
    if(attackPressed == true){
        playerAttack();
    }
    //This is where the 'soft' attack cooldown is executed
    if(attackPower < 0){
        attackPower = 0; //Stops attack power from going below 0
    } else if(attackPower > 100){
        attackPower = 100; //Stops attack power from going above 100
    } else if(attackPower >0||attackPower<100){//Regenerates attack power
        attackPower+=0.1;
    } 
    
    player1.draw(); //Draws the first player object
    player2.draw(); //Draws the second player object
    //console.log(attackPower) //Prints the attack power
    
    if(attackPower>0){ //Renders the attack power bar
        ctx.fillStyle = "blue";
        ctx.fillRect(HEALTH_POS_X+MAX_ATTACK_POWER,HEALTH_POS_Y,attackPower,HEALTH_SIZE);
    } else if(attackPower<=0){
        ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
        ctx.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        //setTimeout(damagePlayer, 1000)
    } else if(backUpAttack <= 0){
        backUpAttack = 0; //Stops backup attack power from going below 0
    }

}


