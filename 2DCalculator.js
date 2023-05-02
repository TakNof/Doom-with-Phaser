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
let player;
let playerPositionX = canvasSizeX/2;
let playerPositionY = canvasSizeY/2;
let playerAngle = 0;

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
let playerHeader;
let pHeCord = [0, 0, 0, 0, 0, 0]
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
let Xcomponent = Math.cos(playerAngle + Math.PI/2) * -defaultVelocity;
let Ycomponent = Math.sin(playerAngle + Math.PI/2) * -defaultVelocity;

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

    raycaster = new Raycaster(playerAngle, playerPositionX, playerPositionY, rays2DAmount);
    enemyRaycaster = new EnemyRaycaster(enemyPositionX, enemyPositionY, playerPositionX,playerPositionY);
    rayDrawing = new Graphicator(wallBlockSizeX, canvasSize, rays3DCameraWidth, rays3DCameraAmount);
}

function create(){
    //Creating the grid.
    grid = this.add.grid(0, 0, canvasSizeX*2, canvasSizeY*2, 32, 32, 0x00b9f2).setAltFillStyle(0x016fce).setOutlineStyle();

    //Creating the input of the keys.
    cursors = this.input.keyboard.createCursorKeys();
    keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);


    //Creating the main character.
    player = this.add.sprite(playerPositionX, playerPositionY, 'player');

    this.physics.add.existing(player, false);

    player.body.setAllowRotation(true);

    player.body.setCollideWorldBounds(true);


    //Creating the indicator for the pov of the player.
    playerHeader = this.add.triangle(playerPositionX, playerPositionY, pHeCord[0], pHeCord[1], pHeCord[2], pHeCord[3], pHeCord[4], pHeCord[5], "0xff0000");

    this.physics.add.existing(playerHeader, false);
    
    playerHeader.body.setSize(64, 64, true);
    
    playerHeader.body.setAllowRotation(true);

    playerHeader.body.setCollideWorldBounds(true);

    //Here we are creating the enemy.

    enemy = this.add.sprite(enemyPositionX, enemyPositionY, 'enemy');

    this.physics.add.existing(enemy,false);

    enemy.body.setAllowRotation(true);

    enemy.body.setCollideWorldBounds(true);

    cacodemon = this.add.sprite(playerPositionX, canvasSizeY*3, 'cacodemon');

    this.physics.add.existing(cacodemon,false);

    cacodemon.body.setAllowRotation(true);

    cacodemon.body.setCollideWorldBounds(false);

    //Here we create the indicator for the pov of the enemy.
    enemyHeader = this.add.triangle(enemyPositionX, enemyPositionY, pHeCord[0], pHeCord[1], pHeCord[2], pHeCord[3], pHeCord[4], pHeCord[5], "0xff0000");

    this.physics.add.existing(enemyHeader, false);
    
    enemyHeader.body.setSize(64, 64, true);
    
    enemyHeader.body.setAllowRotation(true);

    enemyHeader.body.setCollideWorldBounds(true);

    //Here we create the map walls.
    if(generateWalls && generateRandomWalls){
        //If true, random walls will be generated.

        //Creating the group for the walls.
        walls = this.physics.add.staticGroup();

        //Creating the matrix with booleans through method.
        wallOrder = generateWallMatrix();
        
        for(let i = 0; i < amountWalls; i++){
            //within this loop we generate the walls through random positioning
            //and scale of each wall.

            //In order to make things more simple we generate the walls acording to the grid we generated
            //and the scale of the walls. So instead of asking for the coordinates of the wall we ask for its
            //position in the grid.

            //We stablish the starting grid point of the wall in x,y.
            let wallStartX = getRndInteger(0, wallNumberRatioX);
            let wallStartY = getRndInteger(0, wallNumberRatioY);

            //And then the extension of the wall in x,y as well.
            let blockExtentionX;
            let blockExtentionY;

            //This while loop will prevent the walls from being generated out of bounds.
            do{
                blockExtentionX = getRndInteger(1, 5);
                blockExtentionY = getRndInteger(1, 5);
                
            }while(blockExtentionX + wallStartX > wallNumberRatioX ||
                blockExtentionY + wallStartY > wallNumberRatioY);    

            //Then we use two for loops to change the value in the matrix by true;
            for(let j = wallStartY; j < blockExtentionY + wallStartY; j++){
                for(let k = wallStartX; k < blockExtentionX + wallStartX; k++){
                    if(wallStartX < playerPositionX/32 < blockExtentionX + wallStartX){
                        wallOrder[j][k] = true;
                    }
                }
            }

            for(let k = 0; k < wallNumberRatioX; k++){
                wallOrder[0][k] = true;
                wallOrder[wallNumberRatioY - 1][k] = true;
            }

            for(let j = 0; j < wallNumberRatioY; j++){
                wallOrder[j][0] = true;
                wallOrder[j][wallNumberRatioX - 1] = true;
            }
            //With the matrix wall created we stablish it with to the raycaster and enemyRaycaster.
            raycaster.setMatrix = wallOrder;
            enemyRaycaster.setMatrix = wallOrder;

            //Now with the wall positions being true in the matrix the only thing that lefts to do is to
            //traverse the matrix looking for the true values, if found, a wall object will be generated.
            for(let i = 0; i < wallNumberRatioY; i++){
                for(let j = 0; j < wallNumberRatioX; j++){
                    if(wallOrder[i][j] === true){
                        let wallPositionX = (j*32) + 16;
                        let wallPositionY = (i*32) + 16;
                        walls.create(wallPositionX , wallPositionY, this.add.sprite(wallPositionX , wallPositionY, "wall").setDepth(1));
                    }
                }
            }
        }
        
    }else if(generateWalls && !generateRandomWalls){
        //If generateRandomWalls is false, then it means some tests are going to be
        //done, so we generate a limited number of walls to make the test run.

        //The logic its the same as the previous part.
        walls = this.physics.add.staticGroup();
        wallOrder = generateWallMatrix();

        let wallStartX = 15;
        let wallStartY = getRndInteger(0, 8);

        let blockExtentionX = 3;
        let blockExtentionY = 3;

        for(let j = wallStartY; j < blockExtentionY + wallStartY; j++){
            for(let k = wallStartX; k < blockExtentionX + wallStartX; k++){
                if(wallStartX < playerPositionX/32 < blockExtentionX + wallStartX){
                    wallOrder[j][k] = true;
                }
            }
        }
        
        raycaster.setMatrix = wallOrder;
        enemyRaycaster.setMatrix = wallOrder;

        for(let i = 0; i < wallNumberRatioY; i++){
            for(let j = 0; j < wallNumberRatioX; j++){
                if(wallOrder[i][j] === true){
                    let wallPositionX = (j*32) + 16;
                    let wallPositionY = (i*32) + 16;
                    walls.create(wallPositionX , wallPositionY, this.add.sprite(wallPositionX , wallPositionY, "wall").setDepth(1));
                }
            }
        }

    }

    //Here we stablish the raycasting.

    //first we have to calculate all the rays distance for the player and the enemy.
    ray2DCoordinates = raycaster.drawRays2D();
    ray2DEnemyCoordinates = enemyRaycaster.detectWalls();
    
    //Then we have to add all the lines to the array we created, with the same properties and atributes as the previous objects.
    for(let i = 0; i < rays2DAmount; i++){
        rays[i] = this.add.line(playerPositionX, playerPositionY, 0, 0, 0, 0, "0x00ff00");
        rays[i].setTo(0, 0, 0, -playerPositionY);
        this.physics.add.existing(rays[i], false);
        rays[i].body.setAllowRotation(true);
        rays[i].body.setSize(64, 64, true);
        rays[i].body.setCollideWorldBounds(true);
        this.physics.add.collider(rays[i], walls);
    }
    
    //The same goes with the enemyRay
    enemyRay = this.add.line(enemyPositionX, enemyPositionY, 0, 0, 0, 0, "0x000000");
    enemyRay.setTo(0, 0, 0, -enemyPositionY);
    this.physics.add.existing(enemyRay, false);
    enemyRay.body.setAllowRotation(true);
    enemyRay.body.setSize(64, 64, true);
    enemyRay.body.setCollideWorldBounds(true);
    this.physics.add.collider(enemyRay, walls);

    //With the rays calculated we redraw the lines from the sight of the player.
    redrawRay2D();   

    //Here we add the interaction collider between the objects and the walls.
    this.physics.add.collider(player, walls);
    this.physics.add.collider(playerHeader, walls);
    this.physics.add.collider(enemy, walls);
    this.physics.add.collider(enemyHeader, walls);

    //The distance of each ray is needed to draw the 3D graphics, so we load the to the object.
    rayDrawing.setDistance = ray2DCoordinates.distance;

    //Here we stablish the rectangles of the 3D graphics
    for(let i = 0; i < rays3DCameraAmount; i++){
        rays3DCamera[i] = this.add.rectangle(rays3DCameraWidth/2 + i*rays3DCameraWidth, canvasSizeY + 0.5*canvasSizeY, rays3DCameraWidth, canvasSizeY/3,"0x00ff00").setDepth(1);;
        this.physics.add.existing(rays3DCamera[i], false);
    }

    //Then we redraw them.
    redrawRay3D();

    drawEnemy();
}

function update(){
    //This function updates each certain time working like the game clock.

    //Here we stablish the atributes for the player.
    player.body.setVelocity(0);
    playerHeader.body.setVelocity(0);       
    player.rotation = playerAngle;
    playerHeader.rotation = playerAngle;

    //Here we stablish the atributes for the enemy.
    enemyRaycaster.setRayAngle = player;
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
    for(let ray of rays){
        ray.body.setVelocity(0);
    }
    
    raycaster.setPlayerPosition = player;
    enemyRaycaster.setPlayerPosition = player;
    enemyRaycaster.setEnemyPosition = enemy;


    ray2DCoordinates = raycaster.drawRays2D();
    redrawRay2D(); 
    redrawRay3D();
    drawEnemy();

    if(cursors.up.isDown ^ cursors.down.isDown){
        velocityX = player.body.velocity.x + Xcomponent;
        velocityY = player.body.velocity.y + Ycomponent;

        // console.log(`Vx: ${velocityX} Vy: ${velocityY}`);

        if (cursors.up.isDown){   
            //Here we use the velocity calculated, and we change its sign accordingly to the direction of movement.
            player.body.setVelocityX(velocityX);
            player.body.setVelocityY(velocityY);
    
            playerHeader.body.setVelocityX(velocityX);
            playerHeader.body.setVelocityY(velocityY);
            
            for(let ray of rays){
                ray.body.setVelocityX(velocityX);
                ray.body.setVelocityY(velocityY);
            }
            
        }else if(cursors.down.isDown){    
            player.body.setVelocityX(-velocityX);
            player.body.setVelocityY(-velocityY);
    
            playerHeader.body.setVelocityX(-velocityX);
            playerHeader.body.setVelocityY(-velocityY);
    
            for(let ray of rays){
                ray.body.setVelocityX(-velocityX);
                ray.body.setVelocityY(-velocityY);
            }
        }
    }

    if(cursors.left.isDown ^ cursors.right.isDown){
        //Here we use trigonometrics to calculate the x and y component of the velocity.

        Xcomponent = Math.cos(playerAngle + Math.PI/2) * -defaultVelocity;
        Ycomponent = Math.sin(playerAngle + Math.PI/2) * -defaultVelocity;


        if (cursors.left.isDown){
            playerAngle -= angleOperator;

            //If the angle ends being less than zero then we add 2pi to make it rotate one lap.
            if(playerAngle < 0){
                playerAngle += 2*Math.PI;
            }
        }else if(cursors.right.isDown){
            playerAngle += angleOperator;

            //If the angle ends being more than 2Pi then we substract 2pi to make it rotate one lap.
            if(playerAngle > 2*Math.PI){
                playerAngle -= 2*Math.PI;
            }
        }

        //Because we are changing the angle, we have to load it to the reycaster
        raycaster.setRayAngle = playerAngle;
    }
}

function redrawRay2D(){
    //This method allows the recalculation of the ray coordinates and redraws it.
    for(let i = 0; i < rays2DAmount; i++){
        //The XEquation and YEquation are needed due to the fact that the ray is drawn according to "local" coordinates,
        //so we have to convert them to global coordinates.
        XEquation = - player.x + ray2DCoordinates.x[i];
        YEquation = - player.y + ray2DCoordinates.y[i];
        rays[i].setTo(0, 0, XEquation, YEquation);
    }

    //We to the same with the enemy ray.
    XEquation = - enemy.x + ray2DEnemyCoordinates.x[0];
    YEquation = - enemy.y + ray2DEnemyCoordinates.y[0];
    enemyRay.setTo(0, 0, XEquation, YEquation);
}

function redrawRay3D(){
    //This method allows the recalculation of the 3D ray coordinates and redraws it.
    for(let i = 0; i < rays3DCameraAmount; i++){
        rayDrawing.setHeight = ray2DCoordinates.distance[i];
        rays3DCamera[i].setPosition(rays3DCameraWidth/2 + i*    rays3DCameraWidth, (canvasSizeY + 0.8*canvasSizeY ) - rayDrawing.getHeight()/2);
        rays3DCamera[i].setSize(rays3DCameraWidth, rayDrawing.getHeight());

        if(ray2DCoordinates.typeOfHit[i] === "vertical"){
            rays3DCamera[i].setFillStyle("0x004200");
        }else{
            rays3DCamera[i].setFillStyle("0x00ff00");
        }
    }
}

function distanceEnemyWallPlayer(){
    //Its imporntant to know the player distance regards to the enemy, same with the wall the enemy is
    //aiming at.

    //With these distances we can know if the wall is infront of the player or not.
    let distancePlayer = raycaster.hypoCalc(enemy.x, enemy.y);
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
        let enemyXcomponent = Math.cos(angle) * (defaultVelocity/1.8);
        let enemyYcomponent = Math.sin(angle) * (defaultVelocity/1.8);
        let enemyVelocityX = player.body.velocity.x + enemyXcomponent;
        let enemyVelocityY = player.body.velocity.y + enemyYcomponent;

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
    let enemyAngleInv = raycaster.checkLimitsAngle(enemyRaycaster.getRayAngle +  Math.PI);
    let globalPlayerAngle = raycaster.checkLimitsAngle(playerAngle + 3*Math.PI/2);
    let rangeAngles = [raycaster.checkLimitsAngle(globalPlayerAngle - Math.PI/4) , raycaster.checkLimitsAngle(globalPlayerAngle + Math.PI/4)];
    
    if(enemyAngleInv + Math.PI/4 >= 2*Math.PI){
        rangeAngles[1] = rangeAngles[1] + 2*Math.PI;
    }else if(enemyAngleInv - Math.PI/4 <= Math.PI/4){
        rangeAngles[0] = rangeAngles[0] - 2*Math.PI;
    }
       
    if(enemyAngleInv > rangeAngles[0] && enemyAngleInv < rangeAngles[1] ){
        // console.log("drawing demon");
        cacodemon.visible = true;

        let enemyHeight = rayDrawing.setHeightEnemy(raycaster.hypoCalc(enemy.x, enemy.y));
        
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

function generateWallMatrix(){
    //With this method we can generate the matrix for the walls.
    raycaster.setMatrixDimensions = [wallNumberRatioX, wallNumberRatioY];
    enemyRaycaster.setMatrixDimensions = [wallNumberRatioX, wallNumberRatioY];
    
    let wallOrder = [];

    let row = Array(wallNumberRatioX);

    for(let j = 0; j < wallNumberRatioX; j++){
        row[j] = false;
    }

    for(let i = 0; i < wallNumberRatioY; i++){
        wallOrder.push(row.concat());
    }

    return wallOrder;
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

function readMatrix(){
    for(let i = 0; i < wallNumberRatioY; i++){
        for(let j = 0; j < wallNumberRatioX; j++){
            console.log(wallOrder[i][j]);
        }
    }
}

function hypoCalc(x1, x2, y1, y2){
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
}