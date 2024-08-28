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
        this.grid = this.add.grid(0, 0, canvasSize.width*2, canvasSize.height*2, 32, 32, 0x00b9f2).setAltFillStyle(0x016fce).setOutlineStyle();

        //Here we create the walls of the map.
        this.walls = new WallsBuilder(this, this.wallsConfig);
        //Here we create the player.
        this.player = new Player(this, game3D, {x: 0, y: 0}, this.playerConfig);
        
        this.cacodemons = new EnemyGroup(this, game3D, 10, 15, this.cacodemonConfig);

        this.player.setWeaponManager();

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
    }

    update(time, delta){
        this.fpscounter.setText((1000/delta).toFixed(1));
        //The basic movement of the player.
        if(this.player.isAlive){
            this.player.update();
            this.cacodemons.callAll("update");            
        }else if(this.player.getScore() == undefined){
            this.player.setTimeAlive();
            this.player.setScore("Defeat");
            this.scene.launch("endGameMenu", {endGameState: "Defeat", score: this.player.getScore()});
        }

        if((this.cacodemons.getChildren().length == 0 || (this.cacodemons.getChildren()[0].getHealth() == 0 && this.cacodemons.getChildren().length == 1)) && this.player.getScore() == undefined){
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