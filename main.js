//Title: "Bonded"
//Developed by: Thomas Jackson
//Art by: Thomas Jackson
//License: Creative Commons Attribution-NonCommercial-NoDerivs 2.0
//Language: javascript#



const CANVAS_WIDTH = 1000;//This constant is the canvas width
const CANVAS_HEIGHT = 500;//This constant is the canvas height
const HEALTH_POS_X = 10;//This constant is the x position of the health
const HEALTH_POS_Y = 10;//This constant is y position of the health
const HEALTH_SIZE = 10;//This constant is the size of the health
const PLAYER_SIZE = 16;//This constant is the size of the player
const MAX_ATTACK_POWER = 100;//This constant is the maximum attack power
const GAME_OVER_TEXT = "Game Over";//This is the text for the game over game state

const PLAYER_1_IMAGE = new Image();//This is the first player image
const PLAYER_2_IMAGE = new Image();//This is the second player image
const ENEMY_IMAGE = new Image();//This is the image for the enemy
const START_BUTTON_IMAGE = new Image();//This is the image for the start button
const LOGO_IMAGE = new Image();//This is the image for the logo
const PAUSE_BUTTON_IMAGE = new Image();//This is the image for the pause button



//These lines set the sources of my images
PLAYER_1_IMAGE.src = "images/player1.png";
PLAYER_2_IMAGE.src = "images/player2.png";
ENEMY_IMAGE.src = "images/enemy.png";
START_BUTTON_IMAGE.src = "images/startButton.png";
LOGO_IMAGE.src = "images/logo.png";
PAUSE_BUTTON_IMAGE.src = "images/pauseButton.png";



var lives = 3;//This is the number of lives
var playerSpeed = 1.25;//This is the player's speed coefficient
var rightPressed = false;//This variable is for right button press
var leftPressed = false;//This variable is for left button press
var upPressed = false;//This variable is for up button press
var downPressed = false;//This variable is for down button press
var attackPressed = false;//This variable is for attack button press
var beamSize = 5;//This variable is for beam size
var attackPower = 100;//This variable is for attack power
var enemySpeed = 0.5;//This is the enemy's speed coeffficient
var attack//This is the attack variable (boolean)
var score = 0;//This is the score variable
var gameState = "photosensitiveWarning";//Sets the gameState to menu
var photosensitiveMode = false;//This is the variable for photosensitive mode
class GameObject{//This is the GameObject class, for any object that needs positions, sizes, drawing, or movement
    constructor(id,image,x,y,width,height){//Constructor for the entity, had the identifier, texture, coordinates, and size
        this.id=id;
        this.image=image;
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;
    }

    setPosition(x,y){//Sets the position of the entity
        this.x=x;
        this.y=y;
    }
    draw(){//Draws the entity
        //console.log(player);
        //ctx.fillRect(this.x,this.y,this.width,this.height);
        ctx.drawImage(this.image,this.x,this.y,this.width,this.height);//Draws the entity
    }
    move(direction, distance){//Moves the entity
        switch(direction){//Checks the direction
            case "right": //Moves the player to the right
                this.x+=distance;
                break;
            case "left": //Moves the player to the left
                this.x-=distance;
                break;
            case "up": //Moves the player up
                this.y-=distance;
                break;
            case "down": //Moves the player down
                this.y+=distance;
                break;
        }
    }
}
const MENU_LOGO = new GameObject("menuLogo",LOGO_IMAGE,CANVAS_WIDTH/2-448/2,2*80/4,448,80);//Creates the menu logo
const MENU_START_BUTTON = new GameObject("menuStartButton",START_BUTTON_IMAGE,CANVAS_WIDTH/2-160/2,CANVAS_HEIGHT/2-160/2,160,160);//Creates the start button
const PAUSE_BUTTON = new GameObject("pauseButton",PAUSE_BUTTON_IMAGE,CANVAS_WIDTH-(16*2),0+(16),16,16);//This is the pause button
//var entities = [];
var player1 = new GameObject("player1",PLAYER_1_IMAGE,(CANVAS_WIDTH/4)-PLAYER_SIZE,CANVAS_HEIGHT/2,PLAYER_SIZE,PLAYER_SIZE); //Makes the player's first GameObject
var player2 = new GameObject("player2",PLAYER_2_IMAGE,3*(CANVAS_WIDTH/4),CANVAS_HEIGHT/2,PLAYER_SIZE,PLAYER_SIZE);//Makes the player's second GameObject
var currentEnemies=[];//This is the array where the enemies are stored
// let coordsAttack = [];
//entities.push(player);

function getPlayerDistance(){
    return Math.sqrt(Math.pow(player1.x-player2.x,2)+Math.pow(player1.y-player2.y,2)); //This uses the pythagoras theorem to find the distance between the two players
}
function playerAttack(){
    ctx.beginPath();//Starts the path
    ctx.lineWidth = beamSize//Sets the line width to that of the game
    if(player1.x < player2.x){//Checks if the player is to the left of the other player
        ctx.moveTo(player1.x + PLAYER_SIZE/2,player1.y + PLAYER_SIZE/2);//Moves the path to the player's position
        ctx.lineTo(player2.x+PLAYER_SIZE/2,player2.y+PLAYER_SIZE/2);//Draws a line to the player's position
    } else if(player1.x > player2.x){//Checks if the player is to the right of the other player
        ctx.moveTo(player1.x+PLAYER_SIZE/2, player1.y+PLAYER_SIZE/2)//Moves the path to the player's position
        ctx.lineTo(player2.x+PLAYER_SIZE/2, player2.y+PLAYER_SIZE/2)//Draws a line to the player's position
    }
    ctx.strokeStyle = "white";//Sets the color to red
    ctx.stroke();//Fills the line
    attackPower-=2;//Reduces the attack power
}
function damagePlayer(){//This function damages the player
    if(photosensitiveMode!=true){//Checks if the player is not in photosensitive mode so that the flashes can happen
        ctx.fillStyle = "white"; // Set the color to white
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);//Makes a flash of white
    }
    player1.setPosition(CANVAS_WIDTH/4,CANVAS_HEIGHT/2);//Resets the player's position
    player2.setPosition(3*(CANVAS_WIDTH/4),CANVAS_HEIGHT/2);//Resets the player's position
    lives--;//Removes a life
    for(i=0;i<currentEnemies.length;i++){//Removes all enemies
        currentEnemies[i].setPosition(Math.random()*CANVAS_WIDTH,Math.random()*CANVAS_HEIGHT);//Resets the enemy's position
    }
}

function closestPlayer(object){//Uses pythagoras theorem to find the closest player
    if(Math.sqrt(Math.pow(player1.x-object.x,2)+Math.pow(player1.y-object.y,2))<Math.sqrt(Math.pow(player2.x-object.x,2)+Math.pow(player2.y-object.y,2))){//Checks if the player is closer to the first player
        return player1;
    } else {
        return player2;
    }
}

function trackPlayer(object,speed){//This makes objects follow the first player
    if(object.x>player1.x){
        object.move("left",speed);//Moves the enemy to the left if the player is to the left
    } else if(object.x<player1.x){
        object.move("right",speed);//Moves the enemy to the right if the player is to the right
    }
    if(object.y>player1.y){
        object.move("up",speed);//Moves the enemy up if the player is above
    } else if(object.y<player1.y){
        object.move("down",speed);//Moves the enemy down if the player is below
    }
}


function playerCollision(object){//Checks if an object collides with teh player
    if(object.x<player1.x+PLAYER_SIZE && object.x+object.width>player1.x && object.y<player1.y+PLAYER_SIZE && object.y+object.height>player1.y){
        return true; //Returns true if the player1 GameObject is colliding with the object
    } else if(object.x<player2.x+PLAYER_SIZE && object.x+object.width>player2.x && object.y<player2.y+PLAYER_SIZE && object.y+object.height>player2.y){
        return true; //Returns true if the player2 GameObject is colliding with the object
    } else {
        return false;//Returns false when the object is not colliding with the player
    }
}

function generateEnemies(number){//This function generates enemies with the input number
    for(i=0;i<number;i++){//Generates the enemies
        currentEnemies.push(new GameObject("enemy"+i,ENEMY_IMAGE,Math.random()*CANVAS_WIDTH,Math.random()*CANVAS_HEIGHT,PLAYER_SIZE,PLAYER_SIZE));
    }
}

function doEnemies(){//Moves and draws the enemies
    for(i=0;i<currentEnemies.length;i++){
        currentEnemies[i].draw();//Draws the enemy
        trackPlayer(currentEnemies[i],enemySpeed);//Moves the enemy in the direction of the first player
        if(playerCollision(currentEnemies[i])){//If the enemy collides with the player
            damagePlayer();//The player gets damaged
        }
    }
}

function attackProcedures(){//This function governs everything related to the attack that needs to be exectuted every frame.
    if(attackPressed == true&&attackPower>0&&(player1.y-player2.y==0)){//Checks if the attack button is pressed and if the attack power is greater than 0 and if the players are on the same y-axis
        attack = true
    }else if(attackPressed == true&&attackPower>0&&((player1.x-player2.x)<5&&(player1.x-player2.x)>-5)){//Checks if the attack button is pressed and if the attack power is greater than 0 and if the players are on the same x-axis
        attack = true
    }else{
        attack = false
    }//Executes the player's attack

    //This is where the 'soft' attack cooldown is executed
    if(attackPower < 0){//Checks if the attack power is less than 0
        attackPower = 0; //Stops attack power from going below 0
    } else if(attackPower > 100){//Checks if the attack power is greater than 100
        attackPower = 100; //Stops attack power from going above 100
    } else if((attackPower >0||attackPower<100)&&attackPressed!=true){//Regenerates attack power
        attackPower+=0.2;
    }
    if(attack == true){//Checks if the player is attacking
        playerAttack();//Executes the player's attack
    }
    if(attackPower>0){ //Renders the attack power bar
        ctx.fillStyle = "blue";
        ctx.fillRect(HEALTH_POS_X+MAX_ATTACK_POWER,HEALTH_POS_Y,attackPower,HEALTH_SIZE);
    } else if(attackPower<20&&attackPower>=0&&photosensitiveMode==false){ //Renders the attack power bar
        ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
        ctx.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
    }
}

window.addEventListener('keydown', keyDown)//Adds a keydown event listener
window.addEventListener('keyup', keyUp)//Adds a keyup event listener
window.onload = startCanvas;//This is the main loop of the game
function startCanvas() {
    ctx = document.getElementById("canvas").getContext("2d");
    gameDiv = document.getElementById("gameDiv");
    canvas = document.getElementById("canvas"); // RESIZECANVAS get the canvas element
    //canvas.addEventListener('mousemove', mouseMove); // add the mousemove event listener to the canvas element
    canvas.addEventListener('click', mouseClick); // add the mouseclick event listener to the canvas element
    generateEnemies(2);//Adds 2 enemies to the game
    score = 0;//Sets the score to 0
    gameInterval = setInterval(()=>{//Starts the game
        if(gameState=="menu"){
            menuLoop();//When the gameState is set to menu, the menu is drawn
        } else if(gameState=="pauseMenu"){
            pauseMenuLoop();//When the gameState is set to pauseMenu, the pauseMenu is drawn
        }else if(gameState=="game"){
            mainLoop();//If the gameState is set to game, the game is in progress
        } else if(gameState=="gameOver"){
            deathLoop();//When the gameState is set to false, the death loop is activated, which can lead back to the menu or to the game
        } else if(gameState=="photosensitiveWarning"){
            photosensitiveWarningLoop();//When the gameState is set to photosensitiveWarning, the photosensitiveWarning loop is activated
        }
    }, 10); // Set up the animation with an interval timer
}

function mouseClick(event) {//This function is called when the mouse is clicked
    if(event.offsetX >=MENU_START_BUTTON.x&&event.offsetX <=MENU_START_BUTTON.x+MENU_START_BUTTON.width&&event.offsetY >=MENU_START_BUTTON.y&&event.offsetY <=MENU_START_BUTTON.y+MENU_START_BUTTON.height&&(gameState=="menu"||gameState=="gameOver")){//If the mouse is clicked on the start button
        gameState="game";//If the mouse is clicked on the start button, the gameState is set to game
        lives = 3;
        generateEnemies(2);//Adds 2 enemies to the game
    }
}

function keyDown(keyboardEvent){//This function is called when a key is pressed and responds accordingly when certain keys are pressed
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
        case "Enter"://When the p key is pressed, the game will move from the photosensitivity warning to the menu and plays the game's soundtrack
            if(gameState=="photosensitiveWarning"){
                gameState="menu";
                sound.play();
            }
            break;
        case "p"://When the p key is pressed, the game will enable photosensitivity mode and move to the menu and plays the game's soundtrack
            if(gameState=="photosensitiveWarning"){
                photosensitiveMode = true;
                gameState="menu";
                sound.play();
            }
            break;
        case " "://Attacks
            if(attackPower >0){
                attackPressed = true;
            }
            break;
    }
}

function checkAttack(){//Detects if enemies are on the line that runs between the player objects.
    if(attack == true){
        for(i=0;i<currentEnemies.length;i++){
            if(((currentEnemies[i].x>player1.x && currentEnemies[i].x<player2.x)||(currentEnemies[i].x<player1.x && currentEnemies[i].x>player2.x)) && Math.round(currentEnemies[i].y)==(CANVAS_HEIGHT/2)){//Checks if the enemy is on the line
                currentEnemies.splice(i,1);//Removes the enemy from the game
                score += 100;//Adds to the score
            }else if(((currentEnemies[i].y>player1.y && currentEnemies[i].y<player2.y)||(currentEnemies[i].y<player1.y && currentEnemies[i].y>player2.y)) && Math.round(currentEnemies[i].x)==(CANVAS_WIDTH/2)){//Checks if the enemy is on the line
                currentEnemies.splice(i,1);//Removes the enemy from the game
                score += 100;//Adds to the score
            }
        }
    }
}

function keyUp(keyboardEvent){//This function is called when the key is released and responds if certain keys are pressed
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

function menuLoop(){//This function is called when the gameState is set to menu and does all the important things for the menu such as text and the buttons
    ctx.fillStyle = "black"; // Set the color to black
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);//Makes a black background
    //console.log("menu");
    MENU_START_BUTTON.draw();//Draws the start button
    MENU_LOGO.draw();//Draws the logo

    ctx.fillStyle = "white";//Sets the color to white
    ctx.font = "30px arial";//Sets the font to 30px arial
    ctx.fillText("How to play:",25,CANVAS_HEIGHT/2);//Writes the text "How to play"
    ctx.font = "20px arial";//Sets the font to 20px arial
    ctx.fillText("WASD to move Square",25,CANVAS_HEIGHT/2+25);//Writes the text "WASD to move Square"
    ctx.fillText("Circle moves the opposite to Square",25,CANVAS_HEIGHT/2+50);//Writes the text "Circle moves the opposite to Square"
    ctx.fillText("Space to attack",25,CANVAS_HEIGHT/2+75)//Writes the text "Space to attack"
}

function pauseMenuLoop(){
}

function photosensitiveWarningLoop(){//This loop displays all the text for the photosensitive warning
    ctx.fillStyle="black";//Sets the color to black
    ctx.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);//Makes a black background
    ctx.fillStyle="red";//Sets the color to red
    ctx.font = "50px Arial";//Sets the font to 50px Arial
    ctx.fillText("Photosensitivity warning!",CANVAS_WIDTH/2-250,CANVAS_HEIGHT/2-100);//Writes the text "Photosensitivity warning!"
    ctx.fillStyle = "white";//Sets the color to white
    ctx.font = "20px Arial";//Sets the font to 20px Arial
    ctx.fillText("Flashing colours, strobe effect, seizure risk",CANVAS_WIDTH/2-200,CANVAS_HEIGHT/2);//Writes the text "Flashing colours, strobe effect, seizure risk"
    ctx.fillText("Press 'enter' to skip to menu",CANVAS_WIDTH/2-200,CANVAS_HEIGHT/2+50);//Writes the text "Press 'enter' to skip to menu"
    ctx.fillText("Press 'p' to enter photosensitive mode",CANVAS_WIDTH/2-200,CANVAS_HEIGHT/2+100);//Writes the text "Press 'p' to enter photosensitive mode"
}

function deathLoop(){
    ctx.fillStyle="black";//Sets the color to black
    ctx.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);//Makes a black background
    ctx.fillStyle="red";//Sets the color to white
    ctx.font = '48px arial';//Sets the font to 48px serif
    ctx.fillText(GAME_OVER_TEXT,CANVAS_WIDTH/2-GAME_OVER_TEXT.length*15,CANVAS_HEIGHT/4);//Draws the game over text
    MENU_START_BUTTON.draw();//Draws the start button
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
        currentEnemies = [];//Clears the enemies
    }
    if(getPlayerDistance()<20){
        damagePlayer();
    } else if(player1.x<0||player1.x>CANVAS_WIDTH-PLAYER_SIZE||player1.y<0||player1.y>CANVAS_HEIGHT-PLAYER_SIZE){
        damagePlayer();
    }
    //This is where the movement and attack are actually executed
    if(rightPressed == true && attack != true){
        player1.move("right",playerSpeed);
        player2.move("left",playerSpeed);
        //console.log("right");
    }//Moves the player right when
    if(leftPressed == true && attack != true){
        player1.move("left",playerSpeed);
        player2.move("right",playerSpeed);//Moves the player left
    }
    if(upPressed == true && attack != true){
        player1.move("up",playerSpeed);
        player2.move("down",playerSpeed);
    }//Moves the player up
    if(downPressed == true&& attack != true){
        player1.move("down",playerSpeed);
        player2.move("up",playerSpeed);
    }//Moves the player down
    //console.log(player1.x-player2.x)
    console.log(currentEnemies)
    if(currentEnemies.length==0){
        //console.log("no");
        generateEnemies(Math.floor(score/200))
    }

    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText(score.toString(),CANVAS_WIDTH/4,HEALTH_POS_Y+25);//Draws the score

    attackProcedures();//This runs all the important attack related things like the attack animation and the attack itself
    checkAttack();//This checks if the player's attack hits an enemy and deals with it accordingly
    player1.draw(); //Draws the first player GameObject
    player2.draw(); //Draws the second player GameObject
    PAUSE_BUTTON.draw();
    doEnemies(); //Draws the enemies and runs other enemy related things
}
