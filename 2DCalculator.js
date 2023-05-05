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

//Variables for the movement and for other actions.
let cursors;
let keySpace;
let Introkey;

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
// let player;
// let playerPositionX = canvasSizeX/2;
// let playerPositionY = canvasSizeY/2;
// let playerAngle = 0;

let player2;

//Stablishing the enemy and its initial position.
let enemy;
let enemyHeader;
let enemyPositionX = canvasSizeX/4;
let enemyPositionY = canvasSizeY/4;
let enemyAngle = 0;
let chaseDistance = 300;
let allowChase = true;


let cacodemon;
let cacodemonAngle = 0;

//Stablishing the player header, which was useful at the beginning of the development.
// let playerHeader;
let pHeCord = [0, 0, 0, 0, 0, 0];
pHeCord[0] = 0;
pHeCord[1] = -18;
pHeCord[2] = pHeCord[0] + 32;
pHeCord[3] = pHeCord[1];
pHeCord[4] = pHeCord[2]/2;
pHeCord[5] = pHeCord[3] - 30;

//Stablishing the velocity standards for the player and elements
let velocityX;
let velocityY;
let defaultVelocity = 300;

//Stablishing the initial values for the player movement through its x,y components.
// let Xcomponent = Math.cos(playerAngle + Math.PI/2) * -defaultVelocity;
// let Ycomponent = Math.sin(playerAngle + Math.PI/2) * -defaultVelocity;

//Rotation coeficient.
let angleOperator = 0.05;

//Stablishing the raycaster elements.
let raycaster;
let rayDrawing;

let rays2DAmount = 100;
let rays = Array(rays2DAmount);
let ray2DCoordinates;

//Stablishing the simple raycaster of the enemy.
let enemyRay;
let enemyRaycaster;
let ray2DEnemyCoordinates;

//These variables are used for the correct positioning of the rays (due the use of local coordinates).
let YEquation;
let XEquation;

// let rays3DCameraWidth = 8;
// let rays3DCameraAmount = parseInt(canvasSizeX/rays3DCameraWidth);

let rays3DCameraAmount = rays2DAmount;
let rays3DCameraWidth = canvasSizeX/rays3DCameraAmount;

let rays3DCamera = Array(rays3DCameraAmount);

//The length of the arc generated through the raycast of the player.
let arcLength = 7*Math.PI/2;

//With the preload method we preload the sprites and we generate the object from the raycaster class.
function preload(){
    this.load.image("wall", "assets/wall.png", {frameWidth: 32, frameHeight: 32});
    this.load.image("player", "assets/doomguy64x64.png", {frameWidth: 64, frameHeight: 64});
    this.load.image("enemy", "assets/enemy.jpg", {frameWidth: 64, frameHeight: 64});
    this.load.image("cacodemon", "assets/cacodemon.png");

    enemyRaycaster = new EnemyRaycaster(enemyPositionX, enemyPositionY, canvasSizeX/2, canvasSizeY/2);
}

function create(){
    //Creating the grid.
    grid = this.add.grid(0, 0, canvasSizeX*2, canvasSizeY*2, 32, 32, 0x00b9f2).setAltFillStyle(0x016fce).setOutlineStyle();

    //Here we are creating the enemy.

    enemy = this.add.sprite(enemyPositionX, enemyPositionY, 'enemy');

    this.physics.add.existing(enemy,false);

    enemy.body.setAllowRotation(true);

    enemy.body.setCollideWorldBounds(true);


    cacodemon = this.add.sprite(canvasSizeX/2, canvasSizeY*3, 'cacodemon');

    this.physics.add.existing(cacodemon,false);

    cacodemon.body.setAllowRotation(true);

    cacodemon.body.setCollideWorldBounds(false);

    //Here we create the indicator for the pov of the enemy.
    enemyHeader = this.add.triangle(enemyPositionX, enemyPositionY, pHeCord[0], pHeCord[1], pHeCord[2], pHeCord[3], pHeCord[4], pHeCord[5], "0xff0000");

    this.physics.add.existing(enemyHeader, false);
    
    enemyHeader.body.setSize(64, 64, true);
    
    enemyHeader.body.setAllowRotation(true);

    enemyHeader.body.setCollideWorldBounds(true);

    //Here we create the walls of the map.
    walls = new WallsBuilder(this, "wall", [canvasSizeX, canvasSizeY], wallBlockSizeX, amountWalls, generateWalls, generateRandomWalls);
    walls.createWalls();

    enemyRaycaster.setMatrix = walls.getWallMatrix;
    
    player2 = new Player(this, [canvasSizeX/2, canvasSizeY/2, 0], "player", wallBlockSizeX*2, 0, defaultVelocity, angleOperator);

    player2.setRaycaster(rays2DAmount, 5*Math.PI/4);
    player2.getRaycaster.setMatrix = walls.getWallMatrix;

    player2.setRays();

    player2.setGraphicator(canvasSize);

    

    //Here we stablish the raycasting.

    //first we have to calculate all the rays distance for the player and the enemy.
    ray2DEnemyCoordinates = enemyRaycaster.detectWalls();
        
    //The same goes with the enemyRay
    enemyRay = this.add.line(enemyPositionX, enemyPositionY, 0, 0, 0, 0, "0x000000");
    enemyRay.setTo(0, 0, 0, -enemyPositionY);
    this.physics.add.existing(enemyRay, false);
    enemyRay.body.setAllowRotation(true);
    enemyRay.body.setSize(64, 64, true);
    enemyRay.body.setCollideWorldBounds(true);
    this.physics.add.collider(enemyRay, walls);


    //Here we add the interaction collider between the objects and the walls.
    this.physics.add.collider(enemy, walls);
    this.physics.add.collider(enemyHeader, walls);

    //The distance of each ray is needed to draw the 3D graphics, so we load the to the object.

    //Here we stablish the rectangles of the 3D graphics

    //Then we redraw them.
    drawEnemy();
}

function update(){
    //This function updates each certain time working like the game clock.

    //Here we stablish the atributes for the player.
    
    //Here we stablish the atributes for the enemy.
    enemyRaycaster.setRayAngle = player2.getPosition;
    enemyAngle = enemyRaycaster.getRayAngle;
    
    enemy.body.setVelocity(0);
    enemyHeader.body.setVelocity(0);
    enemyRay.body.setVelocity(0);
    
    ray2DEnemyCoordinates = enemyRaycaster.detectWalls();

    if(allowChase){
        enemy.body.velocity.x = updateEnemyPosition()[0];
        enemy.body.velocity.y = updateEnemyPosition()[1];
        enemyHeader.body.velocity.x = updateEnemyPosition()[0];
        enemyHeader.body.velocity.y = updateEnemyPosition()[1];

        enemyRay.body.velocity.x = updateEnemyPosition()[0];
        enemyRay.body.velocity.y = updateEnemyPosition()[1];
    }else{
        enemy.rotation = enemyRaycaster.getRayAngle - 3*Math.PI/2;
        enemyHeader.rotation = enemyAngle - 3*Math.PI/2;
    }

    //And here we stablish the atributes for the rays.
    
    enemyRaycaster.setPlayerPosition = player2.getPosition;
    enemyRaycaster.setEnemyPosition = enemy;


    redrawRay2D(); 
    drawEnemy();

    player2.move();

    player2.getGraphicator.redraw3DScaling(player2.getRayData.distance, player2.getRayData.typeOfHit);
}

function redrawRay2D(){
    //This method allows the recalculation of the ray coordinates and redraws it.

    //We to the same with the enemy ray.
    XEquation = - enemy.x + ray2DEnemyCoordinates.x[0];
    YEquation = - enemy.y + ray2DEnemyCoordinates.y[0];
    enemyRay.setTo(0, 0, XEquation, YEquation);
}

function distanceEnemyWallPlayer(){
    //Its imporntant to know the player distance regards to the enemy, same with the wall the enemy is
    //aiming at.

    //With these distances we can know if the wall is infront of the player or not.
    let distancePlayer = hypoCalc(enemy.x, player2.getPositionX, enemy.y, player2.getPositionY);
    let distanceWall = enemyRaycaster.hypoCalc(ray2DEnemyCoordinates.x, ray2DEnemyCoordinates.y);

    return [distancePlayer, distanceWall];
}

function updateEnemyPosition(){
    
    //We want the enemy to chase the player, so we need to setup some conditions.

    let distance = distanceEnemyWallPlayer();

    //We want the enemy to follow us if we are in range of sight and if the distance with the player is less than the distance
    //with the wall.
    if (distance[0] <= chaseDistance && distance[0] > 10 && (distance[0] < distance[1] || distance[1] == undefined)) {
        let angle = enemyRaycaster.getRayAngle;
        let enemyXcomponent = Math.cos(angle) * (defaultVelocity/2);
        let enemyYcomponent = Math.sin(angle) * (defaultVelocity/2);
        let enemyVelocityX = enemyXcomponent;
        let enemyVelocityY = enemyYcomponent;

        //We want the enemy to react when we are 
        enemy.rotation = enemyRaycaster.getRayAngle - 3*Math.PI/2;
        enemyHeader.rotation = enemyAngle - 3*Math.PI/2;

        return[enemyVelocityX, enemyVelocityY];
    }else{
        return [0,0];
    }    
}

function drawEnemy(){
    // console.log(playerAngle + 5*Math.PI/4, enemyRaycaster.getRayAngle + Math.PI, playerAngle + 7*Math.PI/4);
    let distance = distanceEnemyWallPlayer();
    let enemyAngleInv = adjustAngleValue(enemyRaycaster.getRayAngle +  Math.PI);
    let globalPlayerAngle = adjustAngleValue(player2.getRotation + 3*Math.PI/2);
    let rangeAngles = [adjustAngleValue(globalPlayerAngle - Math.PI/4) , adjustAngleValue(globalPlayerAngle + Math.PI/4)];
    
    if(enemyAngleInv + Math.PI/4 >= 2*Math.PI){
        rangeAngles[1] = rangeAngles[1] + 2*Math.PI;
    }else if(enemyAngleInv - Math.PI/4 <= Math.PI/4){
        rangeAngles[0] = rangeAngles[0] - 2*Math.PI;
    }
       
    if(enemyAngleInv > rangeAngles[0] && enemyAngleInv < rangeAngles[1] ){
        // console.log("drawing demon");
        cacodemon.visible = true;

        let enemyHeight = player2.getGraphicator.setHeightEnemy(distance[0]);
        
        if(enemyHeight/100 > 2.5){
            cacodemon.scaleY = 2.5;
            cacodemon.scaleX = 2.5;
        }else{
            cacodemon.scaleY = enemyHeight/100;
            cacodemon.scaleX = enemyHeight/100;
        }
        
        cacodemon.x = drawElementByPlayerPov(enemyAngleInv, rangeAngles[1]);
        cacodemon.y = (canvasSizeY + 0.5*canvasSizeY ) - enemyHeight/2;

        cacodemon.setDepth(3);
        
    }else{
        cacodemon.visible = false;
    }

    if(distance[0] > distance[1]){
        cacodemon.setDepth(0);
    }
}

function drawElementByPlayerPov(angle, playerAngle){
    let newArcLenght = 7*Math.abs(angle - playerAngle);
    return (-(canvasSizeX*newArcLenght/arcLength) + canvasSizeX);
}

function hypoCalc(x1, x2, y1, y2){
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
}

function adjustAngleValue(angle){
    if(angle < 0){
        angle += 2*Math.PI;
    }else if(angle > 2*Math.PI){
        angle -= 2*Math.PI;
    }

    return angle;
}