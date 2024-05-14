class OptionsGenerator{

    /**
     * The constructor for the option generator class.
     * @param {Scene} scene The scene to generate the options.
     * @param {[String]} menuOptionsStr An array of the menu options to generate the options.
     * @param {JSON} config The configuration for the options.
     */
    constructor(scene, menuOptionsStr, config){
        this.scene = scene;
        this.menuOptionsStr = menuOptionsStr;
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

        this.menuOptions = {};

        let optionsMaxWidth = 0;

        for(let [i, option] of menuOptionsStr.entries()){
            this.menuOptions[option] = this.scene.add.dynamicBitmapText(canvasSize.width/2 + this.config.xOffset, this.config.yOffset + i*100, "doomSFont", option);
            this.menuOptions[option].setFontSize(this.config.fontSize);
            this.menuOptions[option].setOrigin(0.5, 0);

            if(this.menuOptions[option]._bounds.lines.longest > optionsMaxWidth){
                optionsMaxWidth = this.menuOptions[option]._bounds.lines.longest
            }
        }
    }

    destroy(){
        for(let option of this.menuOptionsStr){
            this.menuOptions[option].destroy();
        }
    }
}