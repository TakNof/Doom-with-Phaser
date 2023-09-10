class Game2D extends Phaser.Scene{
    constructor(){
        super({key: "Game2D"});

        //Visual grid to visualize better the space.
        this.grid;

        //Stablishing the walls, their size, how much there will be and some conditionals for testing purposes.
        this.walls;
        this.wallOrder;
        this.wallBlockSize = 32;
        this.amountWalls = 18;
        this.generateWalls = true;
        this.generateRandomWalls = true;

        //Stablishing the player and its initial position.
        this.player;
        this.playerFOV = 90*Math.PI/180;
        this.playerAngleOffset = 3*Math.PI/2
        this.playerFOVangleOffset = this.playerAngleOffset - this.playerFOV/2

        //Stablishing the enemy and its initial position.
        this.amountEnemies = 18;

        this.cacodemons;

        this.enemyAngleOffset = 3*Math.PI/2;
        this.allowChase = true;
        this.allowShoot = false;
        this.playerHealth = Infinity;


        //Stablishing the velocity standards for the player and enemies.
        this.defaultVelocity = 300;

        //Rotation coeficient.
        this.angleOperator = 3.5;

        this.music; 
    }

    //With the preload method we preload the sprites and we generate the object from the raycaster class.
    preload(){
        this.load.image("wall", "./assets/wall.png", {frameWidth: 32, frameHeight: 32});

        this.load.image("player", "./assets/Player/Sprites/doomguy64x64.png", {frameWidth: 64, frameHeight: 64});

        for(let soundName of ["heal", "hurt", "death"]){
            this.load.audio(`player_${soundName}_sound`, `./assets/Player/Sounds/player_${soundName}_sound.wav`);
        }

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

        this.keyEsc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        this.physics.world.setBounds(0, 0, canvasSize.width, canvasSize.height);

        //Creating the grid.
        this.grid = this.add.grid(0, 0, canvasSize.width*2, canvasSize.height*2, 32, 32, 0x00b9f2).setAltFillStyle(0x016fce).setOutlineStyle();

        //Here we create the walls of the map.
        this.walls = new WallsBuilder(this, "wall", this.wallBlockSize, this.amountWalls, this.generateWalls, this.generateRandomWalls);
        this.walls.createWalls();
        
        //Here we create the player.
        this.player = new Player(
            this,
            game3D,
            {x: canvasSize.width/2, y: canvasSize.height/2, angleOffset: this.playerAngleOffset},
            "player",
            0,
            this.wallBlockSize*2,
            this.defaultVelocity,
            this.angleOperator,
            this.playerHealth,
            this.playerAngleOffset
        );

        //Here we create the raycaster of the player and we pass it the position of the walls to make the calculations.
        this.player.setRaycaster(this.walls.getWallMatrix(), this.playerAngleOffset);
        this.player.getRaycaster().setAngleStep(this.playerFOV);

        //Here we put the color of the rays of the player.
        this.player.setDebug(true);
        this.player.setSpriteRays(colors.limeGreen);

        //here we create the graphicator of the raycaster of the player.
        this.player.setGraphicator();

        //We set all the elements we need to collide with the walls.
        this.player.setColliderElements();

        this.player.setWeapons(weapons);

        //We load those elements to the walls object.
        this.walls.setColliders(this.player.getColliderElements());

        //We create a certain amount of cacodemons.
        this.cacodemons = new EnemyGroup(this, game3D, this.amountEnemies, this.walls, cacodemon);

        this.walls.setColliders(this.cacodemons);

        this.player.setHUD();
        this.player.getHUD().setHUDElementValue("ammo", this.player.getCurrentWeapon().getProjectiles().countActive(false), false);

        this.fpscounter = new HUDText(game3D, 0, 0, "", this.player.getHUD().style, 1000, {both: 0});
        
        //Here we stablish the camera of the player with the raycaster, graphicator and the enemies positions.
        this.player.setCamera(this.playerFOV);
        this.player.getCamera().setEnemies(this.cacodemons.getChildren());
        
        this.music = this.sound.add('at_dooms_gate');
        // console.log(this.music);

        this.music.setVolume(0.5);
        this.music.loop = true;

        if(!this.music.isPlaying){
            // this.music.play();
        }
        
        // this.sound.volume = 0.2;
    }

    update(time, delta){
        this.fpscounter.setText((1000/delta).toFixed(1));
        //The basic movement of the player.
        if(this.player.isAlive){
            this.player.move();
            this.player.shoot();
            this.player.reload();
            this.player.switchWeapons();
            
            //The basic movement of the enemy according to the player's position.
            if(this.cacodemons.getChildren().length > 0 && this.allowChase){
                this.cacodemons.callAll("move", this.player.getPosition());
            }
            
            if(this.allowShoot){
                this.cacodemons.callAll("shoot", this.player);
            }   
            
            this.cacodemons.callAll("evalProjectileCollision", this.player);
            // this.cacodemons.callAllSoundPanning(this.player);
            
            for(let enemy of this.cacodemons.getChildren()){
                this.player.evalProjectileCollision(enemy);
                this.walls.evalCollision(enemy.getProjectiles2D(), enemy.getProjectiles3D());
                if(enemy.getHealth() == 0){
                    enemy.waitToDestroy();
                }
            }

            this.walls.evalCollision(this.player.getCurrentWeapon().getProjectiles());
            
        }else{
            if(!this.player.isAlive && this.player.getScore() == undefined){
                this.player.setTimeAlive();
                this.player.setScore("Defeat");
                this.player.getHUD().displayDeathText();

                this.player.getHUD().displayScoreText("Defeat", this.player.getScore());
            }
        }

        if((this.cacodemons.getChildren().length == 0 || (this.cacodemons.getChildren()[0].getHealth() == 0 && this.cacodemons.getChildren().length == 1)) && this.player.getScore() == undefined){
            this.player.setTimeAlive();
            this.player.setScore("Victory");
            this.player.getHUD().displayVictoryText();

            this.player.getHUD().displayScoreText("Victory", this.player.getScore());          
        }

        if(this.keyEsc.isDown){
            this.scene.pause();
            sharedScenes.game3D.scene.pause();
            this.scene.launch("pauseMenu"); 
        }
        
        //Here we draw the 3D representation of the map.
        this.player.getCamera().draw3DWorld();
    }
}

class Game3D extends Phaser.Scene {
    constructor() {
        super({key: "Game3D"});
    }

    preload(){
        for(let weapon of weapons){
            this.load.atlas(weapon.name, weapon.spriteDir, weapon.animationJsonDir);
            this.load.audio(`${weapon.name}_sound`, weapon.soundDir);
        }

        for(let i = 0; i < 3; i++){
            this.load.audio(`switch_weapon_sound_${i + 1}`, `assets/weapons/switch_weapon_sound_${i + 1}.wav`);
        }
        
        this.load.image("bullet", "./assets/Player/Sprites/bullet.png", {frameWidth: 12, frameHeight: 12});

        let enemyActions = ["attack", "hurt", "death"];

        for(let animationName of ["heal", "hurt", "death"]){
            this.load.audio(`player_${animationName}_sound`, `./assets/Player/Sounds/player_${animationName}_sound.wav`);
        }

        this.load.image("cacodemon", "./assets/enemies/cacodemon/Sprites/cacodemon.png");
        for(let action of enemyActions){
            this.load.atlas(`cacodemon_${action}`, `./assets/enemies/cacodemon/Sprites/animations/cacodemon_${action}.png`, `./assets/enemies/cacodemon/Sprites/animations/cacodemon_${action}.json`);
            this.load.audio(`cacodemon_${action}_sound`, `./assets/enemies/cacodemon/sounds/cacodemon_${action}_sound.wav`)
        }

        this.load.image("energy_bomb", "./assets/enemies/cacodemon/Sprites/energy_bomb.png");
        this.load.audio("cacodemon_energy_bomb_sound", "./assets/enemies/cacodemon/Sounds/cacodemon_energy_bomb_sound.wav");
        // this.scene.setVisible(false);
    }

    create() {
        sharedScenes.game3D = this;
    }
}