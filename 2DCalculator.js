let config = {
    type: Phaser.AUTO   ,
    parent: 'phaser-example',
    backgroundColor: '#0072bc',
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
let defaultVelocity = 500;

//Stablishing the initial values for the player movement through its x,y components.
let Xcomponent = Math.cos(playerAngle + Math.PI/2) * -defaultVelocity;
let Ycomponent = Math.sin(playerAngle + Math.PI/2) * -defaultVelocity;

//Rotation coeficient.
let angleOperator = 0.05;

//Stablishing the raycaster elements.
let raycaster;
let rays2DAmount = 100;
let rays = Array(rays2DAmount);
let ray2DCoordinates;

//These variables are used for the correct positioning of the rays (due the use of local coordinates).
let YEquation;
let XEquation;


// let rays3DCameraWidth = 8;
// let rays3DCameraAmount = parseInt(canvasSizeX/rays3DCameraWidth);

let rays3DCameraAmount = 100;
let rays3DCameraWidth = canvasSizeX/rays3DCameraAmount;

let rays3DCamera = Array(rays3DCameraAmount);

//With the preload method we preload the sprites and we generate the object from the raycaster class.
function preload(){
    this.load.image("player", "assets/doomguy64x64.png", {frameWidth: 64, frameHeight: 64});
    this.load.image("wall", "assets/wall.png", {frameWidth: 32, frameHeight: 32});

    raycaster = new Raycaster(playerAngle, playerPositionX, playerPositionY, rays2DAmount);
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

    //Here we create the map walls.
    if(generateWalls == true && generateRandomWalls == true){
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

            //With the matrix wall created we stablish it with to the raycaster.
            raycaster.setMatrix = wallOrder;

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
        
    }else if(generateWalls == true && generateRandomWalls == false){
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

    //first we have to calculate all the rays distance.
    ray2DCoordinates = raycaster.drawRays2D();
    
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
    
    //With the rays calculated we redraw the lines from the sight of the player.
    redrawRay2D();

    //Here we add the interaction collider between the objects and the walls.
    this.physics.add.collider(player, walls);
    this.physics.add.collider(playerHeader, walls);



    rayDrawing.setDistance = ray2DCoordinates.distance;

    for(let i = 0; i < rays3DCameraAmount; i++){
        rays3DCamera[i] = this.add.rectangle(rays3DCameraWidth/2 + i*rays3DCameraWidth, canvasSizeY + 0.5*canvasSizeY, rays3DCameraWidth, canvasSizeY,"0xff0000");
        this.physics.add.existing(rays3DCamera[i], false);
    }

    redrawRay3D();
}

function update(){
    //This function updates each certain time working like the game clock.

    //Here we strablish the atributes for the player.
    player.body.setVelocity(0);
    playerHeader.body.setVelocity(0);       
    player.rotation = playerAngle;
    playerHeader.rotation = playerAngle;

    //And here we stablish the atributes for the rays.
    for(let ray of rays){
        ray.body.setVelocity(0);
    }
    raycaster.setPlayerPosition = player;
    ray2DCoordinates = raycaster.drawRays2D();
    redrawRay2D(); 
    redrawRay3D();

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
}

function redrawRay3D(){
    //This method allows the recalculation of the 3D ray coordinates and redraws it.
    for(let i = 0; i < rays3DCameraAmount; i++){
        if(i + 1 >= rays3DCameraAmount){
            break;
        }else{
            rayDrawing.setDistance = ray2DCoordinates.distance[i];
            rays3DCamera[i].setSize(rays3DCameraWidth, rayDrawing.getDistance());
            // Phaser.Geom.Rectangle.Inflate(rays3DCamera[i], rays3DCameraWidth, rayDrawing.getDistance());
        }
    }
}

function generateWallMatrix(){
    //With this method we can generate the matrix for the walls.
    
    raycaster.setMatrixDimensions = [wallNumberRatioX, wallNumberRatioY];
    
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
