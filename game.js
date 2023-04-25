let config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    backgroundColor: '#0072bc',
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let game = new Phaser.Game(config);

let cursors;

let keySpace;

let player;

let canvasSize = "1024x768";

let canvasSizeX = canvasSize.split("x")[0];
let canvasSizeY = canvasSize.split("x")[1];

let walls;
let wallOrder;

let wallBlockSize = "32x32";

let wallBlockSizeX = parseInt(wallBlockSize.split("x")[0]);
let wallBlockSizeY = parseInt(wallBlockSize.split("x")[1]);

let wallNumberRatioX = parseInt(canvasSizeX/wallBlockSizeX);
let wallNumberRatioY = parseInt(canvasSizeY/wallBlockSizeY);

let amountWalls = 21;

let playerPositionX = parseInt(canvasSizeX)/2;
let playerPositionY = parseInt(canvasSizeY)/2;
let velocityX;
let velocityY;

let defaultVelocity = 90;

let defaultVelocityX = defaultVelocity;
let defaultVelocityY = defaultVelocity;


let playerAngle = 0;
let Xcomponent = Math.cos(playerAngle + Math.PI/2) * -5;
let Ycomponent = Math.sin(playerAngle + Math.PI/2) * -5;
let angleOperator = 0.05;

let playerHeader;
let pHeCord = [0, 0, 0, 0, 0, 0]
pHeCord[0] = 0;
pHeCord[1] = -18;
pHeCord[2] = pHeCord[0] + 32;
pHeCord[3] = pHeCord[1];
pHeCord[4] = pHeCord[2]/2;
pHeCord[5] = pHeCord[3] - 30;

let rayAmount = 100;
let rays = Array(rayAmount);
let point;
let distance;

let generateWalls = true;

let generateRandomWalls = true;

let raycaster;

let rayCoordinates;

let grid;

let YEquation;
let XEquation;

function preload (){
    this.load.image("player", "assets/doomguy64x64.png", {frameWidth: 64, frameHeight: 64});
    this.load.image("wall", "assets/wall.png", {frameWidth: 32, frameHeight: 32});

    raycaster = new Raycaster(playerAngle, playerPositionX, playerPositionY, rayAmount);
}

function create(){
    //Here we create the grid.
    grid = this.add.grid(0, 0, canvasSizeX*2, canvasSizeY*2, 32, 32, 0x00b9f2).setAltFillStyle(0x016fce).setOutlineStyle();

    //Here we stablish the input of the keys.
    cursors = this.input.keyboard.createCursorKeys();
    keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);


    //Here we are creating the main character.
    player = this.add.sprite(playerPositionX, playerPositionY, 'player');

    this.physics.add.existing(player, false);

    player.body.setAllowRotation(true);

    player.body.setCollideWorldBounds(true);


    //Here we create the indicator for the pov of the player
    playerHeader = this.add.triangle(playerPositionX, playerPositionY, pHeCord[0], pHeCord[1], pHeCord[2], pHeCord[3], pHeCord[4], pHeCord[5], "0xff0000");

    this.physics.add.existing(playerHeader, false);
    
    playerHeader.body.setSize(64, 64, true);
    
    playerHeader.body.setAllowRotation(true);

    playerHeader.body.setCollideWorldBounds(true);

    //Here we create the map walls.
    if(generateWalls == true && generateRandomWalls == true){
        walls = this.physics.add.staticGroup();
        wallOrder = generateWallMatrix();
        
        for(let i = 0; i < amountWalls; i++){
            let showXStart = getRndInteger(0, wallNumberRatioX);
            let showYStart = getRndInteger(0, wallNumberRatioY);

            let blockExtentionX;
            let blockExtentionY;

            do{
                blockExtentionX = getRndInteger(1, 5);
                blockExtentionY = getRndInteger(1, 5);
                
            }while(blockExtentionX + showXStart > wallNumberRatioX ||
                blockExtentionY + showYStart > wallNumberRatioY);    

            // console.log("XStart = " + showXStart + ", YStart = " + showYStart + ", block extention X = " + blockExtentionX + ", block extention Y = " + blockExtentionY);

            for(let j = showYStart; j < blockExtentionY + showYStart; j++){
                for(let k = showXStart; k < blockExtentionX + showXStart; k++){
                    if(showXStart < playerPositionX/32 < blockExtentionX + showXStart){
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
        
    }else if(generateWalls == true && generateRandomWalls == false){
        walls = this.physics.add.staticGroup();
        wallOrder = generateWallMatrix();

        let showXStart = 15;
        let showYStart = getRndInteger(0, 8);

        let blockExtentionX = 2;
        let blockExtentionY = 2;

        for(let j = showYStart; j < blockExtentionY + showYStart; j++){
            for(let k = showXStart; k < blockExtentionX + showXStart; k++){
                if(showXStart < playerPositionX/32 < blockExtentionX + showXStart){
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

    //Here we stablish the raycasting

    rayCoordinates = raycaster.drawRays3D();
    
    for(let i = 0; i < rayAmount; i++){
        rays[i] = this.add.line(playerPositionX, playerPositionY, 0, 0, 0, 0, "0x00ff00");
        rays[i].setTo(0, 0, 0, -playerPositionY);
        this.physics.add.existing(rays[i], false);
        rays[i].body.setAllowRotation(true);
        rays[i].body.setSize(64, 64, true);
        rays[i].body.setCollideWorldBounds(true);
        this.physics.add.collider(rays[i], walls);
    }
        
    redrawRay();

    //Here we add the interaction collider between the objects and the walls.
    this.physics.add.collider(player, walls);
    this.physics.add.collider(playerHeader, walls);
}

function update (){
    player.body.setVelocity(0);
    playerHeader.body.setVelocity(0);
    for(let ray of rays){
        ray.body.setVelocity(0);
    }
        
    player.rotation = playerAngle;

    playerHeader.rotation = playerAngle;

    raycaster.setPlayerPosition = player;

    rayCoordinates = raycaster.drawRays3D();
    redrawRay(); 

    if (cursors.up.isDown){
        velocityX = player.body.velocity.x + Xcomponent;
        velocityY = player.body.velocity.y + Ycomponent;

        if(velocityX < 0){
            defaultVelocityX *= -1;
        }

        if(velocityY < 0){
            defaultVelocityY *= -1;
        }

        player.body.setVelocityX((defaultVelocityX*(velocityX/velocityX) + (defaultVelocity*velocityX)));
        player.body.setVelocityY((defaultVelocityY*(velocityY/velocityY) + (defaultVelocity*velocityY)));

        playerHeader.body.setVelocityX((defaultVelocityX*(velocityX/velocityX) + (defaultVelocity*velocityX)));
        playerHeader.body.setVelocityY((defaultVelocityY*(velocityY/velocityY) + (defaultVelocity*velocityY)));
        
        for(let ray of rays){
            ray.body.setVelocityX((defaultVelocityX*(velocityX/velocityX) + (defaultVelocity*velocityX)));
            ray.body.setVelocityY((defaultVelocityY*(velocityY/velocityY) + (defaultVelocity*velocityY)));
        }
        
    }else if(cursors.down.isDown){
        velocityX = player.body.velocity.x + Xcomponent;
        velocityY = player.body.velocity.y + Ycomponent;

        if(velocityX < 0){
            defaultVelocityX *= -1;
        }

        if(velocityY < 0){
            defaultVelocityY *= -1;
        }

        player.body.setVelocityX(-(defaultVelocityX*(velocityX/velocityX) + (defaultVelocity*velocityX)));
        player.body.setVelocityY(-(defaultVelocityY*(velocityY/velocityY) + (defaultVelocity*velocityY)));

        playerHeader.body.setVelocityX(-(defaultVelocityX*(velocityX/velocityX) + (defaultVelocity*velocityX)));
        playerHeader.body.setVelocityY(-(defaultVelocityY*(velocityY/velocityY) + (defaultVelocity*velocityY)));

        for(let ray of rays){
            ray.body.setVelocityX(-(defaultVelocityX*(velocityX/velocityX) + (defaultVelocity*velocityX)));
            ray.body.setVelocityY(-(defaultVelocityY*(velocityY/velocityY) + (defaultVelocity*velocityY)));
        }
    }

    if(cursors.left.isDown || cursors.right.isDown){

        Xcomponent = Math.cos(playerAngle + Math.PI/2) * -5;
        Ycomponent = Math.sin(playerAngle + Math.PI/2) * -5;

        if (cursors.left.isDown){
            playerAngle -= angleOperator;
            if(playerAngle < 0){
                playerAngle += 2*Math.PI;
            }
        }else if(cursors.right.isDown){
            playerAngle += angleOperator;
            if(playerAngle > 2*Math.PI){
                playerAngle -= 2*Math.PI;
            }
        }

        raycaster.setRayAngle = playerAngle;
    }

    if(keySpace.isDown){
        console.log("x2", XEquation, "y2", YEquation, "EQN:", player.y, YEquation, "=", player.y + YEquation);
        console.log("Line x2: ", player.x + rays[0].geom.x2, "y2: ", player.y + rays[0].geom.y2 , "x1: ", rays[0].geom.x1, "y1: ", rays[0].geom.y1);
        console.log("ray coordinates: ", rayCoordinates.x, rayCoordinates.y);
        console.log("player position: ", player.x, player.y);

        console.log("rayAngle: ", raycaster.getRayAngle);

        
        // console.log(rays[0].body.prev.x, rays[0].body.prev.y);
        // console.log(rays[0].body.transform.x, rays[0].body.transform.y);

    }
}

function redrawRay(){
    for(let i = 0; i < rayAmount; i++){
        XEquation = - player.x + rayCoordinates.x[i];
        YEquation = - player.y + rayCoordinates.y[i];

        // let coordinatesText = this.add.text(XEquation, YEquation, `x: ${XEquation}, y: ${YEquation}`, { font: '"Press Start 2P"' });

        rays[i].setTo(0, 0, XEquation, YEquation);

        // point.y = rayCoordinates.y;
        // point.x = rayCoordinates.x;
        // point.text = `x:${rayCoordinates.x} (${parseInt(rayCoordinates.x/32)}), y:${rayCoordinates.y} (${parseInt(rayCoordinates.y/32)})`;

        // distance.y = player.y;
        // distance.x = player.x;
        // distance.text = `Distance: ${raycaster.hypoCalc(rayCoordinates.x - player.x, rayCoordinates.y - player.y)/32}`;
    }
}

function generateWallMatrix(){
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

function calculateMovement(){
    return [Math.acos(playerAngle) * 5, Math.asin(playerAngle) * 5];
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
