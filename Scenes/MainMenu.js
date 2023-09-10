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
                    this.setOptions();
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

    setOptions(){
        switch (options.quality.setting) {
            case 0:
                options.quality.value = 32;
            break;

            case 1:
                options.quality.value = 64;
            break;

            case 2:
                options.quality.value = 96;
            break;

            case 3:
                options.quality.value = 128;
            break;
        }

        switch (options.renderDistance.setting) {
            case 0:
                options.renderDistance.value = 10;
            break;

            case 1:
                options.renderDistance.value = 15;
            break;

            case 2:
                options.renderDistance.value = 20;
            break;
        }

        switch (options.difficulty.setting) {
            case 0:
                cacodemon.chaseDistance = 200;
                cacodemon.maxHealth = 200;
                cacodemon.distanceLimits.min = 400;
                cacodemon.bulletProperties.delay = 5000;
                cacodemon.defaultVelocity = 125;
                cacodemon.bulletProperties.damage = 6;
            break;
        
            case 1:
                cacodemon.chaseDistance = 300;
                cacodemon.maxHealth = 225;
                cacodemon.distanceLimits.min = 320;
                cacodemon.bulletProperties.delay = 3800;
                cacodemon.defaultVelocity = 135;
                cacodemon.bulletProperties.damage = 8;
            break;

            case 3:
                cacodemon.chaseDistance = 1000;
                cacodemon.maxHealth = 320;
                cacodemon.distanceLimits.min = 100;
                cacodemon.bulletProperties.delay = 2500;
                cacodemon.defaultVelocity = 200;
                cacodemon.bulletProperties.damage = 20;
            break;
        }
    }
}

