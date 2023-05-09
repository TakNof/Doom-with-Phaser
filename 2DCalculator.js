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
let wallBlockSize = 32;
let amountWalls = 21;
let generateWalls = true;
let generateRandomWalls = false;

//Stablishing the player and its initial position.
let player;
let playerFOV = 90*Math.PI/180;
let playerAngleOffset = 3*Math.PI/2
let playerFOVangleOffset = playerAngleOffset - playerFOV/2

//Stablishing the enemy and its initial position.
// let enemies = Array(10);

let amountEnemies = 10;
let enemies = Array(amountEnemies);
let cacodemons;
let enemyangleOffset = Math.PI/2;
let chaseDistance = 300;
let allowChase = false;


//Stablishing the velocity standards for the player and enemies.
let defaultVelocity = 300;

//Rotation coeficient.
let angleOperator = 0.05;

//Stablishing the raycaster elements.
let raysAmount = 200;

//Stablishing the default color codes for drawing elements.
const colors = {limeGreen: "0x00ff00", DarkGreen : "0x004200", black: "0x000000"};

const weapons = {shotgun: "shotgun"};

//With the preload method we preload the sprites and we generate the object from the raycaster class.
function preload(){
    this.load.image("wall", "./assets/wall.png", {frameWidth: 32, frameHeight: 32});
    this.load.image("player", "./assets/doomguy64x64.png", {frameWidth: 64, frameHeight: 64});
    this.load.image("small_cacodemon", "./assets/enemy.jpg", {frameWidth: 64, frameHeight: 64});
    this.load.image("cacodemon", "./assets/cacodemon.png");

    this.load.spritesheet(weapons.shotgun, "assets/weapons/shotgun_sprite_sheet.png", {frameWidth: 128, frameHeight: 128});
}

function create(){
    //Creating the grid.
    grid = this.add.grid(0, 0, canvasSizeX*2, canvasSizeY*2, 32, 32, 0x00b9f2).setAltFillStyle(0x016fce).setOutlineStyle();

    //Here we create the walls of the map.
    walls = new WallsBuilder(this, "wall", [canvasSizeX, canvasSizeY], wallBlockSize, amountWalls, generateWalls, generateRandomWalls);
    walls.createWalls();
    
    //Here we create the player.
    player = new Player(this, [canvasSizeX/2, canvasSizeY/2, 0], "player", wallBlockSize*2, 0, defaultVelocity, angleOperator);

    //Here we create the raycaster of the player and we pass it the position of the walls to make the calculations.
    player.setRaycaster(walls.getWallMatrix, raysAmount,  playerFOVangleOffset);
    player.getRaycaster.setAngleStep(playerFOV);

    //Here we put the color of the rays of the player.
    player.setSpriteRays(colors.limeGreen);

    //here we create the graphicator of the raycaster of the player.
    player.setGraphicator = canvasSize ;

    //We set all the elements we need to collide with the walls.
    player.setColliderElements();

    player.setWeapons(canvasSizeX, canvasSizeY, [weapons.shotgun]);
    player.getWeapons[0].setAnimationFrames(8, 6, 0);

    //We load those elements to the walls object.
    walls.setColliders(player.getColliderElements);

    //We create a certain amount of cacodemons.
    cacodemons = new Cacodemon(this, amountEnemies, walls.getWallMatrix, walls.getWallNumberRatio, wallBlockSize, defaultVelocity, chaseDistance, allowChase);
    cacodemons.create();

    //Here we stablish the camera of the player with the raycaster, graphicator and the enemies positions.
    player.setCamera(canvasSize, playerFOV, cacodemons.getEnemies);  
}

function update(){
    //The basic movement of the player.
    player.move();

    player.shoot();

    //The basic movement of the enemy according to the player's position.
    for(let enemy of cacodemons.getEnemies){
        enemy.move(player.getPosition);
    }

    cacodemons.correctSpriteDepth();
    
    //Here we draw the 3D representation of the map.
    player.getCamera.draw3DWorld();
}