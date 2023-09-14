class MainMenu extends Phaser.Scene {
    constructor() {
        super({key: "mainMenu"});
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
        this.background = this.add.image(canvasSize.width/2, canvasSize.height/2, 'background').setScale(0.7);

        let keyCodes = ["space", "enter", "esc"];

        this.controls = {};

        for(let code of keyCodes){
            this.controls[code] = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[code.toUpperCase()]);
        }
        
        this.menuButtons = new ButtonsGenerator(this, canvasSize, this.menuOptions);
    }

    update(){
        this.menuButtons.moveCursor();

        if(this.controls.space.isDown || this.controls.enter.isDown){
            switch (this.menuButtons.selectorPosition) {
                case 0:
                    this.scene.start("selectDifficutly");
                    this.scene.stop();
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

