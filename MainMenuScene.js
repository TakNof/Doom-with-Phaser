class MainMenuScene extends Phaser.Scene {
    constructor() {
        super("mainMenu");
    }

    preload(){
        this.load.image('background', 'assets/doom_cover_image.png');
    }
}