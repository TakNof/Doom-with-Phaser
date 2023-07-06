class MainMenuScene extends Phaser.Scene {
    constructor() {
        super("mainMenu");
        this.canvasSize = {width:1024, height:768}

        this.menuOptions = ["start", "how_to_play", "options", "credits"];
    }

    preload(){
        this.load.image('background', './assets/doom_cover_image.jpg');

        this.load.image("title", "./assets/doom_bigupper_survival_doom.png");

        for(let option of this.menuOptions){
            this.load.image(option, `./assets/doom_small_${option}.png`);
        }

        this.load.image("selector", "./assets/selector.png");

        this.load.audio("selector_sound", "./assets/menuSFX/move_selector_sound.wav")
    }

    create(){
        this.background = this.add.image(this.canvasSize.width/2, this.canvasSize.height/2, 'background').setScale(0.7);

        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        this.keyScape = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SCAPE);

        this.menuButtons = new ButtonsGenerator(this, this.canvasSize, this.menuOptions);
    }

    update(){
        this.menuButtons.moveCursor();

        if(this.keySpace.isDown || this.keyEnter.isDown){
            switch (this.menuButtons.selectorPosition) {
                case 0:
                    this.scene.launch("Game3D");
                    this.scene.start("Game2D");
                break;

                // case 1:
                //     break;

                // case 2:
                //     break;
            
                // default:
                //     break;
            }
        }

    }
}