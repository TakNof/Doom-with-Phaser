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
let canvasSizeStr = "1024x768";
let canvasSize = {width: parseInt(canvasSizeStr.split("x")[0]), height: parseInt(canvasSizeStr.split("x")[1])};

//Visual grid to visualize better the space.
let grid;

//Stablishing the walls, their size, how much there will be and some conditionals for testing purposes.
let walls;
let wallOrder;
let wallBlockSize = 32;
let amountWalls = 21;
let generateWalls = true;
let generateRandomWalls = true;

//Stablishing the player and its initial position.
let player;
let playerFOV = 90*Math.PI/180;
let playerAngleOffset = 3*Math.PI/2
let playerFOVangleOffset = playerAngleOffset - playerFOV/2

//Stablishing the enemy and its initial position.
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
const colors = {
    limeGreen: "0x00ff00",
    DarkGreen : "0x004200",
    black: "0x000000",
    crimsonRed: "0xDC143C",
    sapphireBlue: "0x0F52BA"
};

const weapons = {shotgun: "shotgun"};

let music;

//With the preload method we preload the sprites and we generate the object from the raycaster class.
function preload(){
    this.load.image("wall", "./assets/wall.png", {frameWidth: 32, frameHeight: 32});
    this.load.image("player", "./assets/doomguy64x64.png", {frameWidth: 64, frameHeight: 64});
    this.load.image("small_cacodemon", "./assets/enemy.jpg", {frameWidth: 124, frameHeight: 124});
    this.load.image("cacodemon", "./assets/cacodemon.png");

    this.load.atlas(weapons.shotgun, "assets/weapons/shotgun/shotgun.png", "assets/weapons/shotgun/shotgun.json");
    this.load.audio(weapons.shotgun + '_sound', "assets/sounds/shotgun-sound.mp3");
    this.load.image("bullet", "./assets/bullet.png", {frameWidth: 12, frameHeight: 12})

    this.load.audio("at_dooms_gate", "assets/music/at_dooms_gate.mp3");
}

function create(){ 
    this.physics.world.setBounds(0, 0, canvasSize.width, canvasSize.height);

    //Creating the grid.
    grid = this.add.grid(0, 0, canvasSize.width*2, canvasSize.height*2, 32, 32, 0x00b9f2).setAltFillStyle(0x016fce).setOutlineStyle();

    //Here we create the walls of the map.
    walls = new WallsBuilder(this, "wall", canvasSize, wallBlockSize, amountWalls, generateWalls, generateRandomWalls);
    walls.createWalls();
    
    //Here we create the player.
    player = new Player(this, {x: canvasSize.width/2, y:canvasSize.height/2}, "player", wallBlockSize*2, 0, defaultVelocity, angleOperator);

    //Here we create the raycaster of the player and we pass it the position of the walls to make the calculations.
    player.setRaycaster(walls.getWallMatrix, raysAmount,  playerFOVangleOffset);
    player.getRaycaster.setAngleStep(playerFOV);

    //Here we put the color of the rays of the player.
    // player.setDebug = true;
    player.setSpriteRays(colors.limeGreen);

    //here we create the graphicator of the raycaster of the player.
    player.setGraphicator = canvasSize;

    //We set all the elements we need to collide with the walls.
    player.setColliderElements();

    player.setWeapons(canvasSize, [weapons.shotgun], [30]);
    player.getPlayerCurrentWeapon.setAnimationFrames(8, 10, 0);

    //We load those elements to the walls object.
    walls.setColliders(player.getColliderElements);

    //We create a certain amount of cacodemons.
    cacodemons = new Cacodemon(this, amountEnemies, walls.getWallMatrix, walls.getWallNumberRatio, wallBlockSize, defaultVelocity, chaseDistance, allowChase);
    cacodemons.create(player.getPosition);

    for(let enemy of cacodemons.getEnemies){
        walls.setColliders(enemy.getColliderElements);
    }

    player.setHUD = canvasSize;

    //Here we stablish the camera of the player with the raycaster, graphicator and the enemies positions.
    player.setCamera(canvasSize, playerFOV, cacodemons.getEnemies); 
    
    music = this.sound.add('at_dooms_gate');
    music.setVolume(0.1);
    music.loop = true;
    // music.play();
}

function update(){
    //The basic movement of the player.
    player.move();

    player.shoot();

    for(let i = 0; i < cacodemons.amount; i++){
        // enemy.evalCollision(player.getPlayerCurrentWeapon.getProjectile.getDamage, player.getPlayerCurrentWeapon.getProjectiles);
        if(cacodemons.getEnemies[i].evalCollision(player.getPlayerCurrentWeapon.getProjectiles, player.getPlayerCurrentWeapon.getDamagePerBullet)){
            cacodemons.getEnemies.splice(i, 1);
            cacodemons.amount -= 1;
            break;
        }
    }

    //The basic movement of the enemy according to the player's position.
    cacodemons.move(player.getPosition);

    player.getCamera.setEnemies2D(cacodemons.getEnemies);

    //Here we draw the 3D representation of the map.
    player.getCamera.draw3DWorld();
}