let config = {
    type: Phaser.AUTO   ,
    parent: 'phaser-example',
    backgroundColor: '#000000',
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
        parent: "scene1"
    },
    scale: {
        width: 1024,
        height: 1523
    },

};

//Stablishing the configurations.
const game = new Phaser.Game(config);

//Stablishing the canvas size and its components.
let canvasSize = "1024x768";
let canvasSizeX = parseInt(canvasSize.split("x")[0]);
let canvasSizeY = parseInt(canvasSize.split("x")[1]);

//Visual grid to visualize better the space.
let grid;

//Stablishing the walls, their size, how much there will be and some conditionals for testing purposes.
let walls;
let wallOrder;
let wallBlockSize = "32x32";
let wallBlockSizeX = parseInt(wallBlockSize.split("x")[0]);
let wallBlockSizeY = parseInt(wallBlockSize.split("x")[1]);
let wallNumberRatioX = parseInt(canvasSizeX/wallBlockSizeX);
let wallNumberRatioY = parseInt(canvasSizeY/wallBlockSizeY);
let amountWalls = 21;
let generateWalls = true;
let generateRandomWalls = true;

//Stablishing the player and its initial position.
let player;
let playerFOV = 90*Math.PI/180;
let playerAngleOffset = 3*Math.PI/2
let playerFOVangleOffset = playerAngleOffset - playerFOV/2

//Stablishing the enemy and its initial position.
let enemy;
let enemyangleOffset = Math.PI/2;
let enemyAngle = 0;
let chaseDistance = 300;
let allowChase = true;


//Stablishing the velocity standards for the player and enemies.
let defaultVelocity = 300;

//Rotation coeficient.
let angleOperator = 0.05;

//Stablishing the raycaster elements.
let rays2DAmount = 200;

//Stablishing the default color codes for drawing elements.
let limeGreen = "0x00ff00";
let DarkGreen = "0x004200";
let blackColor = "0x000000";

//With the preload method we preload the sprites and we generate the object from the raycaster class.
function preload(){
    this.load.image("wall", "assets/wall.png", {frameWidth: 32, frameHeight: 32});
    this.load.image("player", "assets/doomguy64x64.png", {frameWidth: 64, frameHeight: 64});
    this.load.image("enemy", "assets/enemy.jpg", {frameWidth: 64, frameHeight: 64});
    this.load.image("cacodemon", "assets/cacodemon.png");
}

function create(){
    //Creating the grid.
    grid = this.add.grid(0, 0, canvasSizeX*2, canvasSizeY*2, 32, 32, 0x00b9f2).setAltFillStyle(0x016fce).setOutlineStyle();

    //Here we create the walls of the map.
    walls = new WallsBuilder(this, "wall", [canvasSizeX, canvasSizeY], wallBlockSizeX, amountWalls, generateWalls, generateRandomWalls);
    walls.createWalls();
    
    //Here we create the player.
    player = new Player(this, [canvasSizeX/2, canvasSizeY/2, 0], "player", wallBlockSizeX*2, 0, defaultVelocity, angleOperator);

    //Here we create the raycaster of the player and we pass it the position of the walls to make the calculations.
    player.setRaycaster(rays2DAmount,  playerFOVangleOffset, walls.getWallMatrix);
    player.getRaycaster.setAngleStep(playerFOV);

    //Here we put the color of the rays of the player.
    player.setRays(limeGreen);

    //here we create the graphicator of the raycaster of the player.
    player.setGraphicator(canvasSize);

    //Here we create an enemy.
    enemy = new Enemy(this, [canvasSizeX/3, canvasSizeY/3, 0], "enemy", wallBlockSize*2, 1, defaultVelocity, chaseDistance, allowChase);

    //We pass load the player position due we need the enemy to chase the player.
    enemy.setAngleToPlayer = player.getPosition;
    
    //Here we stablish the raycaster of the enemy, we pass it as well the matrix of walls.
    enemy.setRaycaster(1, enemyangleOffset, walls.getWallMatrix);
    enemy.getRaycaster.setAngleStep();
    
    //Here we put the color of the rays of the enemy.
    enemy.setRays(blackColor);

    //We create an sprite that will be the 3D representation of the enemy.
    enemy.setEnemy3D(canvasSizeX/2, canvasSizeY*1.5, "cacodemon");

    //Here we stablish the camera of the player with the raycaster, graphicator and the enemies positions.
    player.setCamera(canvasSize, playerFOV, [enemy]);  
}

function update(){
    //The basic movement of the player.
    player.move();

    //The basic movement of the enemy according to the player's position.
    enemy.move(player.getPosition);

    //Here we draw the 3D representation of the map.
    player.getCamera.draw3DWorld();
}