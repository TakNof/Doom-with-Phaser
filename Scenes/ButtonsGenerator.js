class ButtonsGenerator extends OptionsGenerator{

    /**
     * The constructor for the button generator class.
     * @param {Scene} scene The scene to generate the buttons.
     * @param {[String]} menuStr An array of the menu options to generate the buttons.
     * @param {JSON} config The configuration for the buttons.
     */
    constructor(scene, menuStr, config){
        super(scene, menuStr, config);
        this.menuButtons = {};
        this.controls = this.scene.input.keyboard.createCursorKeys();

        for(let key of ["w", "a", "s", "d"]) {
            this.controls[key] = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[key.toUpperCase()]);
        }
        
        this.selector = this.scene.add.sprite(canvasSize.width/2 - this.optionsMaxWidth/2 - 32 + this.config.xOffset, this.config.yOffset, "selector").setScale(0.2);
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
                this.selector.position = this.selector.position == 0 ? this.menuStr.length - 1 : this.selector.position - 1;
            }else if(this.controls.down.isDown || this.controls.s.isDown){
                this.selector.position = this.selector.position == this.menuStr.length - 1 ? 0 : this.selector.position + 1;
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
        super.destroy();
    }
}