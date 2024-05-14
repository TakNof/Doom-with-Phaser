class ButtonsGenerator{

    /**
     * The constructor for the button generator class.
     * @param {Scene} scene The scene to generate the buttons.
     * @param {[String]} menuButtonsStr An array of the menu options to generate the buttons.
     * @param {JSON} config The configuration for the buttons.
     */
    constructor(scene, menuButtonsStr, config){
        this.scene = scene;
        this.menuButtonsStr = menuButtonsStr;
        this.config = {
            xOffset: 0,
            yOffset: 0,
            fontSize: 32
        }
        if(config){
            for(let option in config){
                this.config[option] = config[option];
            }
        }

        this.menuButtons = {};
        this.controls = this.scene.input.keyboard.createCursorKeys();

        for(let key of ["w", "a", "s", "d"]) {
            this.controls[key] = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[key.toUpperCase()]);
        }

        let optionsMaxWidth = 0;

        for(let [i, option] of menuButtonsStr.entries()){
            this.menuButtons[option] = this.scene.add.dynamicBitmapText(canvasSize.width/2 + this.config.xOffset, this.config.yOffset + i*100, "doomSFont", option);
            this.menuButtons[option].setFontSize(this.config.fontSize);
            this.menuButtons[option].setOrigin(0.5, 0);

            if(this.menuButtons[option]._bounds.lines.longest > optionsMaxWidth){
                optionsMaxWidth = this.menuButtons[option]._bounds.lines.longest
            }
        }
        
        this.selector = this.scene.add.sprite(canvasSize.width/2 - optionsMaxWidth/2 - 32 + this.config.xOffset, this.config.yOffset, "selector").setScale(0.2);
        this.selector.position = 0;

        this.setSelectorMovingSound("selector");
    }

    setSelectorMovingSound(selectorStr){
        this.selector.sound = new Sound(this.scene, `${selectorStr}_sound`);
    }

    getSelectorMovingSound(){
        return this.selector.sound;
    }

    moveCursor(){
        if(((this.controls.up.isDown ^ this.controls.down.isDown) || (this.controls.w.isDown ^ this.controls.s.isDown)) && !this.keyIsPressed){
            if (this.controls.up.isDown || this.controls.w.isDown){
                this.selector.position = this.selector.position == 0 ? this.menuButtonsStr.length - 1 : this.selector.position - 1;
            }else if(this.controls.down.isDown || this.controls.s.isDown){
                this.selector.position = this.selector.position == this.menuButtonsStr.length - 1 ? 0 : this.selector.position + 1;
            }
            this.keyIsPressed = true;
            this.getSelectorMovingSound().playSound();

            this.selector.y = this.config.yOffset + this.selector.position*100;
        }else if (this.controls.up.isUp && this.controls.down.isUp && this.controls.w.isUp && this.controls.s.isUp) {
            this.keyIsPressed = false;
        }
    }

    get selectorPosition(){
        return this.selector.position;
    }

    destroy(){
        this.selector.destroy();
        for(let option of this.menuButtonsStr){
            this.menuButtons[option].destroy();
        }
    }
}