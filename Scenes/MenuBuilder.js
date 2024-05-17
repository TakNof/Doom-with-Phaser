class MenuBuilder extends Phaser.Scene{
    /**
     * Constructor of the MenuBuilder class.
     * @param {String} key 
     * @param {Boolean} showTitle 
     * @param {Boolean} showBackground 
     */
    constructor(key, showTitle = false, showBackground = false){
        super({key: key});
        this.showTitle = showTitle;
        this.showBackground = showBackground;
        this.optionSelected = false;
        if (new.target === MenuBuilder) {
            throw new Error("Can not instanciate an abstract class.");
        }
    }

    preload(){
        if(this.showBackground) this.load.image('background', './assets/doom_cover_image.jpg');
        if(this.showTitle) this.load.image("title", "./assets/doom_bigupper_survival_doom.png");
        this.load.bitmapFont('doomNMFont', './assets/fonts/doom-nightmare.png', './assets/fonts/bitmapfont_doom_nightmare.xml');
        this.load.bitmapFont('doomSFont', "./assets/fonts/doom-smallmd.png", "./assets/fonts/bitmapfont_doom_small2.xml");

        this.load.image("selector", "./assets/selector.png");

        this.load.audio("selector_sound", "./assets/menuSFX/move_selector_sound.wav");

        let keyCodes = ["space", "enter", "esc"];

        this.controls = {};

        for(let code of keyCodes){
            this.controls[code] = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[code.toUpperCase()]);
        }

        this.scenes = {};

        for(let scene of this.scene.manager.scenes){
            if(scene.scene.key === "Game2D" || scene.scene.key === "Game3D"){
                this.scenes[scene.scene.key] = scene;
            }
        }
    }

    handleOptionSelected(position){
        throw new Error("handleOptionSelected() must be implemented by subclass");
    }

    handleOptionReturn(){
        throw new Error("handleOptionReturn() must be implemented by subclass");
    }

    /**
     * 
     * @param {{menu: Array<String>, config: JSON}} options 
     * @param {{menu: Array<String>, config: JSON}} buttons 
     * @param {Boolean} showTitle 
     * @param {Boolean} showBackground 
     */
    uploadData(options = {menu: [], config: {}}, buttons = {menu: [], config: {}}){
        if(this.showBackground)  this.background = this.add.image(canvasSize.width/2, canvasSize.height/2, 'background').setScale(0.7);
        if(this.showTitle) this.title = this.add.image(canvasSize.width/2, 150, "title");

        if(this.optionsObject) this.optionsObject.destroy();
        if(this.buttonsObject) this.buttonsObject.destroy();

        this.options = options;
        this.buttons = buttons;

        if(options.menu) this.optionsObject = new OptionsGenerator(this, this.options.menu, this.options.config);
        if(buttons.menu) this.buttonsObject = new ButtonsGenerator(this, this.buttons.menu, this.buttons.config);
    }

    update(){
        try {
            if(this.buttons.menu.length > 1){
                this.buttonsObject.moveCursor();
            }
    
            if(this.controls.esc.isDown){
                this.handleOptionReturn();
            }
    
            if(this.controls.enter.isDown && !this.optionSelected){
                this.optionSelected = true;
                this.handleOptionSelected(this.buttonsObject.selectorPosition);
                console.log("Enter was pressed");
            }
    
            if(this.controls.enter.isUp){
                this.optionSelected = false;
            }
        } catch (error) {
            console.log("An error ocurred in the menu: " + error);
        }
    }
}
