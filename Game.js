class Game2D extends Phaser.Scene{
    constructor(){
        super({key: "Game2D"});

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
        this.playerFOVangleOffset = this.playerAngleOffset - this.playerFOV/2

        //Stablishing the enemy and its initial position.
        this.amountEnemies = 12  ;

        this.cacodemons;

        this.enemyAngleOffset = Math.PI/2;
        this.chaseDistance = 400;
        this.allowChase = true;


        //Stablishing the velocity standards for the player and enemies.
        this.defaultVelocity = 300;

        //Rotation coeficient.
        this.angleOperator = 0.05;

        //Stablishing the raycaster elements.
        this.raysAmount = 100;

        this.music; 
    }

    init() {
        this.sys.game.loop.time = 0;
    }

    //With the preload method we preload the sprites and we generate the object from the raycaster class.
    preload(){
        this.load.image("wall", "./assets/wall.png", {frameWidth: 32, frameHeight: 32});

        this.load.image("player", "./assets/Player/Sprites/doomguy64x64.png", {frameWidth: 64, frameHeight: 64});
        this.load.audio("player_heal_sound", "./assets/Player/Sounds/player_heal_sound.wav");
        this.load.audio("player_hurt_sound", "./assets/Player/Sounds/player_hurt_sound.wav");
        this.load.audio("player_death_sound", "./assets/Player/Sounds/player_death_sound.wav");

        this.load.image("small_cacodemon", "./assets/enemies/cacodemon/Sprites/small_cacodemon.jpg", {frameWidth: 64, frameHeight: 64});

        this.load.audio("cacodemon_attack_sound", "./assets/enemies/cacodemon/Sounds/cacodemon_attack_sound.wav");
        this.load.audio("cacodemon_death_sound", "./assets/enemies/cacodemon/Sounds/cacodemon_death_sound.wav");

        this.load.image("small_energy_bomb", "./assets/enemies/cacodemon/Sprites/small_energy_bomb.png", {frameWidth: 4, frameHeight: 4});
        this.load.audio("cacodemon_energy_bomb_sound", "./assets/enemies/cacodemon/Sounds/cacodemon_energy_bomb_sound.wav");

        this.load.audio("at_dooms_gate", "assets/music/at_dooms_gate.wav");

        
        this.scene.setVisible(false);
        // this.game.canvas.style.display = 'none';
    }

    create(){
        sharedScenes.game2D = this;

        let game3D = sharedScenes.game3D;

        this.controlKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CTRL);

        this.physics.world.setBounds(0, 0, this.canvasSize.width, this.canvasSize.height);

        //Creating the grid.
        this.grid = this.add.grid(0, 0, this.canvasSize.width*2, this.canvasSize.height*2, 32, 32, 0x00b9f2).setAltFillStyle(0x016fce).setOutlineStyle();

        //Here we create the walls of the map.
        this.walls = new WallsBuilder(this, "wall", this.canvasSize, this.wallBlockSize, this.amountWalls, this.generateWalls, this.generateRandomWalls);
        this.walls.createWalls();
        
        //Here we create the player.
        this.player = new Player(this, game3D, {x: this.canvasSize.width/2, y: this.canvasSize.height/2}, "player", this.wallBlockSize*2, 0, this.defaultVelocity, this.angleOperator, 100);

        //Here we create the raycaster of the player and we pass it the position of the walls to make the calculations.
        this.player.setRaycaster(this.walls.getWallMatrix, this.raysAmount,  this.playerFOVangleOffset);
        this.player.getRaycaster.setAngleStep(this.playerFOV);

        //Here we put the color of the rays of the player.
        // this.player.setDebug = true;
        this.player.setSpriteRays(colors.limeGreen);

        //here we create the graphicator of the raycaster of the player.
        this.player.setGraphicator = this.canvasSize;

        //We set all the elements we need to collide with the walls.
        this.player.setColliderElements();

        this.player.setWeapons(this.canvasSize, [weapons.shotgun]);
        this.player.getPlayerCurrentWeapon.setAnimationFrames(8, 10, 0);

        //We load those elements to the walls object.
        this.walls.setColliders(this.player.getColliderElements);

        //We create a certain amount of cacodemons.
        this.cacodemons = new Cacodemon(this, game3D, this.canvasSize,this.amountEnemies, this.walls.getWallMatrix, this.walls.getWallNumberRatio, this.wallBlockSize, this.defaultVelocity/2, this.chaseDistance, this.allowChase);
        this.cacodemons.create(this.player.getPosition, this.enemyAngleOffset);

        for(let enemy of this.cacodemons.getEnemies){
            this.walls.setColliders(enemy.getColliderElements);
        }

        this.player.setHUD(this.canvasSize);
        
        // player.setHUD(this.canvasSize, cacodemons.getEnemies);

        //Here we stablish the camera of the player with the raycaster, graphicator and the enemies positions.
        this.player.setCamera(this.canvasSize, this.playerFOV, this.cacodemons.getEnemies); 
        
        this.music = this.sound.add('at_dooms_gate');
        this.music.setVolume(0.5);
        this.music.loop = true;
        this.music.play();
    }

    update(){
        //The basic movement of the player.
        if(this.player.getIsAlive){
            this.player.move();

            this.player.shoot();

            //The basic movement of the enemy according to the player's position.
            this.cacodemons.move(this.player.getPosition);
        
            this.cacodemons.shoot(this.player);

            for(let enemy of this.cacodemons.getEnemies){
                this.walls.evalCollision(enemy.getProjectiles2D, enemy.getProjectiles3D);

                enemy.evalProjectileCollision(this.player);

                enemy.getDeathSound().setSoundPanning(enemy.getDistanceToPlayer, enemy.angleToElement + Math.PI, this.player.getAngle);

                if(enemy.getHealth == 0){
                    enemy.waitToDestroy();
                }
                
                if(!enemy.getIsAlive){
        
                    this.cacodemons.getEnemies.splice(this.cacodemons.getEnemies.indexOf(enemy), 1);
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

            this.walls.evalCollision(this.player.getPlayerCurrentWeapon.getProjectiles);
            
        }else{
            if(this.player.getScore() == undefined){
                this.player.setTimeAlive();
                this.player.setScore("Defeat", this.amountEnemies);
                this.player.getHUD.displayDeathText();

                this.player.getHUD.displayScoreText("Defeat", this.player.getScore());
            }
            
            // setTimeout(() => {
            //     this.scene.pause();
            // }, 1000);
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

        this.player.getCamera.setEnemies(this.cacodemons.getEnemies);

        //Here we draw the 3D representation of the map.
        this.player.getCamera.draw3DWorld();

        if(this.controlKey.isDown){
            this.music.stop();
            this.scene.stop("Game3D");
            this.scene.stop("Game2D");
            
            this.scene.launch("Game3D");
            this.scene.start("Game2D");
        }
    }
}

class Game3D extends Phaser.Scene {
    constructor() {
        super({key: "Game3D"});
    }

    preload(){
        this.load.atlas(weapons.shotgun.name, weapons.shotgun.spriteDir, weapons.shotgun.animationJsonDir);
        this.load.audio(weapons.shotgun.name + '_sound', weapons.shotgun.soundDir);
        this.load.image("bullet", "./assets/Player/Sprites/bullet.png", {frameWidth: 12, frameHeight: 12});

        this.load.image("cacodemon", "./assets/enemies/cacodemon/Sprites/cacodemon.png");
        this.load.atlas("cacodemon_attack", "./assets/enemies/cacodemon/Sprites/attackSpriteSheet/Caco_att_animation.png", "./assets/enemies/cacodemon/Sprites/attackSpriteSheet/Caco_att_animation.json");
        this.load.audio("cacodemon_attack_sound", "./assets/enemies/cacodemon/Sounds/cacodemon_attack_sound.wav");
        this.load.audio("cacodemon_death_sound", "./assets/enemies/cacodemon/Sounds/cacodemon_death_sound.wav");

        this.load.image("energy_bomb", "./assets/enemies/cacodemon/Sprites/energy_bomb.png");
        this.load.audio("cacodemon_energy_bomb_sound", "./assets/enemies/cacodemon/Sounds/cacodemon_energy_bomb_sound.wav");
    }

    create() {
        sharedScenes.game3D = this;
    }
}