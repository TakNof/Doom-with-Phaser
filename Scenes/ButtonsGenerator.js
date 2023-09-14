class ButtonsGenerator{

    /**
     * The constructor for the button generator class.
     * @param {Scene} scene The scene to generate the buttons.
     * @param {{width: number, height: number}} canvasSize The size of the canvas.
     * @param {[String]} menuOptionsStr An array of the menu options to generate the buttons.
     * @param {String} titleStr The name of the image or sprite to generate.
     * @param {String} selectorStr The string of the selector sprite or image.
     */
    constructor(scene, canvasSize, menuOptionsStr, titleStr = "title", selectorStr = "selector"){
        this.scene = scene;
        this.canvasSize = canvasSize;   
        this.title = this.scene.add.image(this.canvasSize.width/2, 150, titleStr);

        this.menuOptions = {};

        this.cursors = this.scene.input.keyboard.createCursorKeys();

        for(let key of ["w", "a", "s", "d"]) {
            this.cursors[key] = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[key.toUpperCase()]);
        }

        this.title = this.scene.add.image(this.canvasSize.width/2, 150, "title");

        let optionsMaxWidth = 0;

        for(let [i, option] of menuOptionsStr.entries()){
            this.menuOptions[option] = this.scene.add.dynamicBitmapText(this.canvasSize.width/2, 350 + i*100, "doomSFont", option);
            this.menuOptions[option].setFontSize(100);
            this.menuOptions[option].setOrigin(0.5, 0);

            if(this.menuOptions[option]._bounds.lines.longest > optionsMaxWidth){
                optionsMaxWidth = this.menuOptions[option]._bounds.lines.longest
            }
        }

        console.log(optionsMaxWidth);
        
        this.selector = this.scene.add.sprite(canvasSize.width/2 - optionsMaxWidth/2 - 32, 350, selectorStr).setScale(0.2);
        this.selector.position = 0;

        this.setSelectorMovingSound(selectorStr);
    }

    setSelectorMovingSound(selectorStr){
        this.selector.sound = new Sound(this.scene, `${selectorStr}_sound`)
    }

    getSelectorMovingSound(){
        return this.selector.sound;
    }

    moveCursor(){
        if(((this.cursors.up.isDown ^ this.cursors.down.isDown) || (this.cursors.w.isDown ^ this.cursors.s.isDown)) && !this.keyIsPressed){
            if (this.cursors.up.isDown || this.cursors.w.isDown){
                if(this.selector.position != 0){
                    this.selector.position -= 1;
                    this.keyIsPressed = true;
                    this.getSelectorMovingSound().playSound();
                }

            }else if(this.cursors.down.isDown || this.cursors.s.isDown){    
                if(this.selector.position != Object.keys(this.menuOptions).length - 1){
                    this.selector.position += 1;
                    this.keyIsPressed = true;
                    this.getSelectorMovingSound().playSound();
                }
            }            

            this.selector.y = 350 + this.selector.position*100;
        }else if (this.cursors.up.isUp && this.cursors.down.isUp && this.cursors.w.isUp && this.cursors.s.isUp) {
            this.keyIsPressed = false;
        }
    }

    get selectorPosition(){
        return this.selector.position;
    }
}