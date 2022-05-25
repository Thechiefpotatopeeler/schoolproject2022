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
const MAX_ATTACK_POWER = 100;
const PLAYER_1_IMAGE = new Image();
const PLAYER_2_IMAGE = new Image();
const ENEMY_IMAGE = new Image();
const START_BUTTON_IMAGE = new Image();

PLAYER_1_IMAGE.src = "images/player1.png";
PLAYER_2_IMAGE.src = "images/player2.png";
ENEMY_IMAGE.src = "images/enemy.png";
START_BUTTON_IMAGE.src = "images/startButton.png";

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
var enemySpeed = 1.3
var gameState = "menu";//Sets the gameState to menu
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
const MENU_START_BUTTON = new Object("menuStartButton",START_BUTTON_IMAGE,CANVAS_WIDTH/2-160/2,CANVAS_HEIGHT/2-160/2,160,160);
//var entities = [];
var player1 = new Object("player1",PLAYER_1_IMAGE,(CANVAS_WIDTH/4)-PLAYER_SIZE,CANVAS_HEIGHT/2,PLAYER_SIZE,PLAYER_SIZE); //Makes the player's first object
var player2 = new Object("player2",PLAYER_2_IMAGE,3*(CANVAS_WIDTH/4),CANVAS_HEIGHT/2,PLAYER_SIZE,PLAYER_SIZE);//Makes the player's second object
var currentEnemies=[];
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

function closestPlayer(object){//Uses pythagoras theorem to find the closest player
    if(Math.sqrt(Math.pow(player1.x-object.x,2)+Math.pow(player1.y-object.y,2))<Math.sqrt(Math.pow(player2.x-object.x,2)+Math.pow(player2.y-object.y,2))){
        return player1;
    } else {
        return player2;
    }
}

function trackPlayer(object){
    if(object.x>player2.x){
        object.move("left",enemySpeed);//Moves the enemy to the left if the player is to the left
    } else if(object.x<player2.x){
        object.move("right",enemySpeed);//Moves the enemy to the right if the player is to the right
    }
    if(object.y>player2.y){
        object.move("up",enemySpeed);//Moves the enemy up if the player is above
    } else if(object.y<player2.y){
        object.move("down",enemySpeed);//Moves the enemy down if the player is below
    }
}

function generateEnemies(number){

    for(i=0;i<number;i++){//Generates the enemies
        currentEnemies.push(new Object("enemy"+i,ENEMY_IMAGE,Math.random()*CANVAS_WIDTH,Math.random()*CANVAS_HEIGHT,PLAYER_SIZE,PLAYER_SIZE));
    }
}

function doEnemies(){//Moves and draws the enemies
    for(i=0;i<currentEnemies.length;i++){
        currentEnemies[i].draw();
        trackPlayer(currentEnemies[i]);
    }
}

window.addEventListener('keydown', keyDown)
window.addEventListener('keyup', keyUp)
window.onload = startCanvas;
function startCanvas() {
    ctx = document.getElementById("canvas").getContext("2d");
    gameDiv = document.getElementById("gameDiv");
    canvas = document.getElementById("canvas"); // RESIZECANVAS get the canvas element
    //canvas.addEventListener('mousemove', mouseMove); // add the mousemove event listener to the canvas element
    canvas.addEventListener('click', mouseClick); // add the mouseclick event listener to the canvas element
    generateEnemies(1);//Adds 5 enemies to the game
    gameInterval = setInterval(()=>{//Starts the game
        if(gameState=="menu"){
            menuLoop();//When the gameState is set to menu, the menu is drawn
        } else if(gameState=="game"){
            mainLoop();//If the gameState is set to game, the game is in progress
        } else if(gamestate=="gameOver"){
            deathLoop();//When the gameState is set to false, the death loop is activated, which can lead back to the menu or to the game
        }
    }, 10); // Set up the animation with an interval timer
}

/*function mouseMove(e) {//This function is called when the mouse is moved
    mouseX = e.offsetX;//Sets the mouseX variable to the mouse's x position
    mouseY = e.offsetY;//Sets the mouseY variable to the mouse's y position
}*/

function mouseClick(e) {//This function is called when the mouse is clicked
    if(e.offsetX >= MENU_START_BUTTON.x&&e.offsetX <= MENU_START_BUTTON.x+MENU_START_BUTTON.width&&e.offsetY >= MENU_START_BUTTON.y&&e.offsetY <= MENU_START_BUTTON.y+MENU_START_BUTTON.height){
        gameState="game";//If the mouse is clicked on the start button, the gameState is set to game
    }
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

function menuLoop(){
    ctx.fillStyle = "black"; // Set the color to black
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);//Makes a black background
    //console.log("menu");
    MENU_START_BUTTON.draw();//Draws the start button
}
function deathLoop(){

}

function mainLoop() {
    // Clear the scren
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    // Every frame, draw all of the lives
    // This loop will draw one red square for each life left
    for(lifeCount = 0; lifeCount < lives; lifeCount++) {
        ctx.fillStyle = (lifeCount < 3) ? "red" : "blue";
        ctx.fillRect(HEALTH_POS_X + lifeCount * 25, HEALTH_POS_Y, HEALTH_SIZE, HEALTH_SIZE); // Draw the life, use the lifeCounter to control the position; // Move to the next life
    }
    if(lives <= 0){
        gameState="gameOver";//When the player runs out of lives, they die.
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
        //console.log("right");
    }//Moves the player right
    if(leftPressed == true){
        player1.move("left",playerSpeed);
        player2.move("right",playerSpeed);//Moves the player left
    }
    if(upPressed == true){
        player1.move("up",playerSpeed);
        player2.move("down",playerSpeed);
    }//Moves the player up
    if(downPressed == true){
        player1.move("down",playerSpeed);
        player2.move("up",playerSpeed);
    }//Moves the player down
    if(attackPressed == true){
        playerAttack();
    }//Executes the player's attack
    //This is where the 'soft' attack cooldown is executed
    if(attackPower < 0){
        attackPower = 0; //Stops attack power from going below 0
    } else if(attackPower > 100){
        attackPower = 100; //Stops attack power from going above 100
    } else if(attackPower >0||attackPower<100){//Regenerates attack power
        attackPower+=0.2;
    } 
    
    player1.draw(); //Draws the first player object
    player2.draw(); //Draws the second player object
    doEnemies(); //Draws the enemies
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


