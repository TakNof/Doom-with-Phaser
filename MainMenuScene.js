class MainMenuScene extends Phaser.Scene {
    constructor() {
        super("mainMenu");
    }

    preload(){
        this.load.image('background', 'assets/doom_cover_image.png');
    }

    create(){
        this.background = this.add.image(400, 300, 'background');
        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update(){
        if(this.keySpace.isDown){
            this.scene.start("Game2D");
            this.scene.launch("Game3D");

        }
    }
}