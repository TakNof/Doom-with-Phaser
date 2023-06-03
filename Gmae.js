class Game extends Phaser.Scene{
    constructor(){
        super("Game");

        //Stablishing the canvas size and its components.
        this.canvasSizeStr = "1024x768";
        this.canvasSize = {width: parseInt(this.canvasSizeStr.split("x")[0]), height: parseInt(this.canvasSizeStr.split("x")[1])};

        //Visual grid to visualize better the space.
        this.grid;

        //Stablishing the walls, their size, how much there will be and some conditionals for testing purposes.
        this.walls;
        this.wallOrder;
        this.wallBlockSize = 32;
        this.amountWalls = 10;
        this.generateWalls = true;
        this.generateRandomWalls = true;

        //Stablishing the player and its initial position.
        this.player;
        this.playerFOV = 90*Math.PI/180;
        this.playerAngleOffset = 3*Math.PI/2
        this.playerFOVangleOffset = playerAngleOffset - playerFOV/2

        //Stablishing the enemy and its initial position.
        this.amountEnemies = 12  ;

        this.cacodemons;
        this.cacodemons2;

        this.enemyangleOffset = Math.PI/2;
        this.chaseDistance = 400;
        this.allowChase = true;


        //Stablishing the velocity standards for the player and enemies.
        this.defaultVelocity = 300;

        //Rotation coeficient.
        this.angleOperator = 0.05;

        //Stablishing the raycaster elements.
        this.raysAmount = 100;

        //Stablishing the default color codes for drawing elements.
        this.colors = {
            limeGreen: "0x00ff00",
            DarkGreen : "0x004200",
            black: "0x000000",
            crimsonRed: "0xDC143C",
            sapphireBlue: "0x0F52BA"
        };


        this.shotgun = {
            name: "shotgun",
            bulletProperties:{
                damage: 80,
                velocity: 1000,
                delay: 1,
                critical: 2.2
            },
            distanceLimits:{
                min: 180,
                max: 1000
            },
            soundDir: "./assets/weapons/shotgun/Sounds/shotgun_sound.mp3",
            spriteDir: "./assets/weapons/shotgun/SpriteSheet/shotgun.png",
            animationJsonDir: "assets/weapons/shotgun/SpriteSheet/shotgun.json"
        }

        this.weapons = {shotgun: this.shotgun};


        this.music;   
    }

    //With the preload method we preload the sprites and we generate the object from the raycaster class.
    preload(){
        this.load.image("wall", "./assets/wall.png", {frameWidth: 32, frameHeight: 32});

        this.load.image("player", "./assets/Player/Sprites/doomguy64x64.png", {frameWidth: 64, frameHeight: 64});
        this.load.audio("player_heal_sound", "./assets/Player/Sounds/player_heal_sound.wav");
        this.load.audio("player_hurt_sound", "./assets/Player/Sounds/player_hurt_sound.wav");
        this.load.audio("player_death_sound", "./assets/Player/Sounds/player_death_sound.wav");

        this.load.image("small_cacodemon", "./assets/enemies/cacodemon/Sprites/small_cacodemon.jpg", {frameWidth: 64, frameHeight: 64});
        this.load.image("cacodemon", "./assets/enemies/cacodemon/Sprites/cacodemon.png");
        this.load.audio("cacodemon_attack_sound", "./assets/enemies/cacodemon/Sounds/cacodemon_attack_sound.wav");
        this.load.audio("cacodemon_death_sound", "./assets/enemies/cacodemon/Sounds/cacodemon_death_sound.wav");

        this.load.image("energy_bomb", "./assets/enemies/cacodemon/Sprites/energy_bomb.png");
        this.load.image("small_energy_bomb", "./assets/enemies/cacodemon/Sprites/small_cacodemon.jpg", {frameWidth: 12, frameHeight: 12});
        this.load.audio("cacodemon_energy_bomb_sound", "./assets/sounds/enemies/cacodemon/cacodemon_energy_bomb_sound.wav");

        this.load.atlas(weapons.shotgun.name, weapons.shotgun.spriteDir, weapons.shotgun.animationJsonDir);
        this.load.audio(weapons.shotgun.name + '_sound', weapons.shotgun.soundDir);
        this.load.image("bullet", "./assets/Player/Sprites/bullet.png", {frameWidth: 12, frameHeight: 12});

        this.load.audio("at_dooms_gate", "assets/music/at_dooms_gate.wav");
    }

    create(){ 
        this.physics.world.setBounds(0, 0, canvasSize.width, canvasSize.height);

        //Creating the grid.
        this.grid = this.add.grid(0, 0, canvasSize.width*2, canvasSize.height*2, 32, 32, 0x00b9f2).setAltFillStyle(0x016fce).setOutlineStyle();

        //Here we create the walls of the map.
        this.walls = new WallsBuilder(this, "wall", canvasSize, wallBlockSize, amountWalls, generateWalls, generateRandomWalls);
        this.walls.createWalls();
        
        //Here we create the player.
        this.player = new Player(this, {x: canvasSize.width/2, y:canvasSize.height/2}, "player", wallBlockSize*2, 0, defaultVelocity, angleOperator, 100);

        //Here we create the raycaster of the player and we pass it the position of the walls to make the calculations.
        this.player.setRaycaster(walls.getWallMatrix, raysAmount,  playerFOVangleOffset);
        this.player.getRaycaster.setAngleStep(playerFOV);

        //Here we put the color of the rays of the player.
        // player.setDebug = true;
        player.setSpriteRays(colors.limeGreen);

        //here we create the graphicator of the raycaster of the player.
        this.player.setGraphicator = canvasSize;

        //We set all the elements we need to collide with the walls.
        this.player.setColliderElements();

        this.player.setWeapons(canvasSize, [weapons.shotgun], [{damage: 80, velocity: 1000, delay: 1}],[{min: 250, max: 1000}]);
        this.player.getPlayerCurrentWeapon.setAnimationFrames(8, 10, 0);

        //We load those elements to the walls object.
        this.walls.setColliders(player.getColliderElements);

        //We create a certain amount of cacodemons.
        this.cacodemons = new Cacodemon(this, canvasSize, amountEnemies, walls.getWallMatrix, walls.getWallNumberRatio, wallBlockSize, defaultVelocity/2, chaseDistance, allowChase);
        this.cacodemons.create(player.getPosition);

        for(let enemy of this.cacodemons.getEnemies){
            this.walls.setColliders(enemy.getColliderElements);
        }

        this.player.setHUD(canvasSize);
        
        // player.setHUD(canvasSize, cacodemons.getEnemies);

        //Here we stablish the camera of the player with the raycaster, graphicator and the enemies positions.
        this.player.setCamera(canvasSize, playerFOV, cacodemons.getEnemies); 
        
        this.music = this.sound.add('at_dooms_gate');
        this.music.setVolume(0.5);
        this.music.loop = true;
        // music.play();
    }

    update(){
        //The basic movement of the player.
        if(this.player.getIsAlive){
            this.player.move();

            this.player.shoot();

            //The basic movement of the enemy according to the player's position.
            this.cacodemons.move(player.getPosition);
        
            this.cacodemons.shoot(player);

            for(let enemy of this.cacodemons.getEnemies){
                this.walls.evalCollision(this.enemy.getProjectiles2D, this.enemy.getProjectiles3D);

                this.enemy.evalProjectileCollision(this.player);

                this.enemy.getDeathSound().setSoundPanning(this.enemy.getDistanceToPlayer, this.enemy.angleToElement + Math.PI, this.player.getAngle);

                if(this.enemy.getHealth == 0){
                    this.enemy.waitToDestroy();
                }
                
                if(!this.enemy.getIsAlive){
        
                    this.cacodemons.getEnemies.splice(this.cacodemons.getEnemies.indexOf(this.enemy), 1);
                    this.cacodemons.amount -= 1;
                    
                    // player.getHUD.getEnemiesHealthValue[i].destroy();
                    // player.getHUD.getEnemiesHealthValue.splice(i, 1);
        
                    // player.getHUD.setEnemiesHealthArray = cacodemons.getEnemies;
                    break;
                }
        
                this.player.evalProjectileCollision(enemy);

                this.player.getHUD.setHealthValue = this.player.getHealth;
            
            }
            
            // player.getHUD.setEnemiesHealthValue = cacodemons.getEnemies;

            this.walls.evalCollision(this.player.getthis.PlayerCurrentWeapon.getProjectiles);
            
        }else{
            if(this.player.getScore() == undefined){
                this.player.setTimeAlive();
                this.player.setScore("Defeat", this.amountEnemies);
                this.player.getHUD.displayDeathText();

                this.player.getHUD.displayScoreText("Defeat", this.player.getScore());
            }
            
            setTimeout(() => {
                this.scene.pause();
            }, 1000);
        }

        if(this.cacodemons.getEnemies.length == 0){
            if(this.player.getScore() == undefined){
                this.player.setTimeAlive();
                this.player.setScore("Victory", this.amountEnemies);
                this.player.getHUD.displayVictoryText();

                this.player.getHUD.displayScoreText("Victory", this.player.getScore());    
            }        
        }
        
        // this.player.getHUD.setEnemiesHealthValue = cacodemons.getEnemies;

        this.player.getCamera.setEnemies(cacodemons.getEnemies);

        //Here we draw the 3D representation of the map.
        this.player.getCamera.draw3DWorld();
    }
}