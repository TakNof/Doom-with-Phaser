class MainMenuScene extends Phaser.Scene {
    constructor() {
        super("mainMenu");
        this.canvasSize = {width:1024, height:768}

        this.menuOptions = ["Start", "How to play", "Options", "Credits"];
    }

    preload(){
        this.load.image('background', './assets/doom_cover_image.jpg');

        this.load.image("title", "./assets/doom_bigupper_survival_doom.png");

        this.load.bitmapFont('doomNMFont', './assets/fonts/doom-nightmare.png', './assets/fonts/bitmapfont_doom_nightmare.xml');
        this.load.bitmapFont('doomSFont', "./assets/fonts/doom-small.png", "./assets/fonts/bitmapfont_doom_small.xml");

        this.load.image("selector", "./assets/selector.png");

        this.load.audio("selector_sound", "./assets/menuSFX/move_selector_sound.wav")
    }

    create(){
        this.background = this.add.image(this.canvasSize.width/2, this.canvasSize.height/2, 'background').setScale(0.7);

        let keyCodes = ["SPACE", "ENTER", "SCAPE"];

        this.controls = this.input.keyboard.createCursorKeys()

        for(let code of keyCodes){
            this.controls[code] = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[code]);
        }
        
        this.menuButtons = new ButtonsGenerator(this, this.canvasSize, this.menuOptions);
    }

    update(){
        this.menuButtons.moveCursor();

        if(this.controls.SPACE.isDown || this.controls.ENTER.isDown){
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

