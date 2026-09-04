class Game2D extends GeneralGameScene{
    constructor(){
        super("Game2D");
    }

    create(){
        sharedScenes.game2D = this;

        let game3D = sharedScenes.game3D;

        this.keyEsc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        this.physics.world.setBounds(0, 0, canvasSize.width, canvasSize.height);

        //Creating the grid.
        this.grid = this.add.grid(0, 0, canvasSize.width*this.wallsConfig.generalSizeMultiplier*2, canvasSize.height*this.wallsConfig.generalSizeMultiplier*2, 32, 32, 0x00b9f2).setAltFillStyle(0x016fce).setOutlineStyle();

        this.items = {};

        //Here we create the walls of the map.
        this.walls = new WallsBuilder(this, this.wallsConfig);
        //Here we create the player.
        this.player = new Player(this, game3D, {x: 0, y: 0}, this.playerConfig);
        
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        this.cameras.main.setScroll(0, 0);

        this.cacodemons = new EnemyGroup(this, game3D, 1, 15, this.cacodemonConfig);
        this.zombies = new EnemyGroup(this, game3D, 1, 15, this.zombieConfig);

        this.player.setWeaponManager();

        let weapons = this.playerConfig.weaponsConfig.list;

        for(let weapon of weapons){
            let fixedName = `${weapon.name}Ammo`;
            fixedName = fixedName.charAt(0).toUpperCase() + fixedName.slice(1);
            this.items[fixedName] = new ItemGroup(this, game3D, fixedName, 10);
        }

        this.items["MedPack"] = new ItemGroup(this, game3D, "MedPack", 10);

        //TODO: Make configuration for the items to simplify processes.

        //We load those elements to the walls object.
        this.walls.setColliders(this.player.colliderElements(), this.cacodemons.groupCollidersElements());

        this.music = this.sound.add('at_dooms_gate');
        this.music.setVolume(0.5);
        this.music.loop = true;

        if(!this.music.isPlaying){
            this.music.play();
        }

        this.player.getCamera().setWorldElements();
        this.fpscounter = new HUDText(game3D, 0, 0, "", this.player.getCamera().hud.style, 1000, {both: 0});
        this.ammoCounter = this.player.camera.hud.setHUDElementValue("ammo", this.player.weaponManager.getCurrentWeapon().bullets.countActive(false), false);
        this.healthCounter = this.player.camera.hud.setHUDElementValue("health", this.player.getHealth(), true, "%");
    }

    update(time, delta){
        this.fpscounter.setText((1000/delta).toFixed(1));
        this.ammoCounter = this.player.camera.hud.setHUDElementValue("ammo", this.player.weaponManager.getCurrentWeapon().bullets.countActive(false), false);
        this.healthCounter = this.player.camera.hud.setHUDElementValue("health", this.player.getHealth(), true, "%");

        //How many "60 FPS frames" this tick represents. 1 at 60Hz, ~0.33 at 180Hz.
        //Clamped so a lag spike / alt-tab can't produce a huge instantaneous turn.
        const frameFactor = Phaser.Math.Clamp(delta / TARGET_FRAME_MS, 0, 4);

        //Keep the follow camera's smoothing frame-rate independent: applying a 0.1
        //lerp every frame catches up 3x faster at 180Hz, so rescale it per tick.
        const followLerp = 1 - Math.pow(1 - 0.1, frameFactor);
        this.cameras.main.setLerp(followLerp, followLerp);

        //The basic movement of the player.
        if(this.player.isAlive){
            this.player.update(frameFactor);
            this.cacodemons.callAll("update", frameFactor);
            this.zombies.callAll("update", frameFactor);
        }else if(this.player.getScore() == undefined){
            this.player.setTimeAlive();
            this.player.setScore("Defeat");
            this.scene.launch("endGameMenu", {endGameState: "Defeat", score: this.player.getScore()});
        }

        if(!this.cacodemons.getFirstAlive() && !this.zombies.getFirstAlive() && this.player.getScore() == undefined){
            this.player.setTimeAlive();
            this.player.setScore("Victory");

            this.scene.launch("endGameMenu", {endGameState: "Victory", score: this.player.getScore()});
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

class Game3D extends Phaser.Scene{
    constructor() {
        super({key: "Game3D"});
    }

    preload(){
        if(game.config.physics.arcade.debug){
            this.cameras.main.setViewport(0, canvasSize.height, canvasSize.width, canvasSize.height);
        }
    }

    create() {
        sharedScenes.game3D = this;
    }
}