class MainMenuScene extends Phaser.Scene {
    constructor() {
        super("mainMenu");
    }

    preload(){
        this.load.image('background', 'assets/doom_cover_image.png');
    }

    create(){
        this.background = this.add.image(400, 300, 'background');
    }
}