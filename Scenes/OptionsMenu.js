class OptionsMenu extends Phaser.Scene{
    constructor() {
        super({key: "optionsMenu"});
        this.menuOptions = ["Restart", "Options", "Exit"];
    }

    preload(){
        this.load.image("title", "./assets/doom_bigupper_survival_doom.png");

        this.load.bitmapFont('doomNMFont', './assets/fonts/doom-nightmare.png', './assets/fonts/bitmapfont_doom_nightmare.xml');
        this.load.bitmapFont('doomSFont', "./assets/fonts/doom-small.png", "./assets/fonts/bitmapfont_doom_small.xml");

        this.load.image("selector", "./assets/selector.png");

        this.load.audio("selector_sound", "./assets/menuSFX/move_selector_sound.wav")
    }

    create(){
        let keyCodes = ["space", "enter", "esc"];

        this.controls = this.input.keyboard.createCursorKeys()

        for(let code of keyCodes){
            this.controls[code] = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[code.toUpperCase()]);
        }
        
        this.menuButtons = new ButtonsGenerator(this, canvasSize, this.menuOptions);
    }

    update(){
        this.menuButtons.moveCursor();

        if(this.controls.esc.isDown){
            this.scene.manager.scenes[1].scene.resume();
            this.scene.manager.scenes[2].scene.resume();
            this.scene.stop();
        }

        if(this.controls.space.isDown || this.controls.enter.isDown){
            switch (this.menuButtons.selectorPosition) {
                case 0:
                    // this.scene.manager.scenes[1].scene.music.stop();
                    this.scene.manager.scenes[1].scene.scene.music.stop();
                    this.scene.stop("Game3D");
                    this.scene.stop("Game2D");
                    
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