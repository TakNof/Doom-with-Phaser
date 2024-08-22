class OptionsGenerator{

    /**
     * The constructor for the option generator class.
     * @param {Scene} scene The scene to generate the options.
     * @param {[String]} menuStr An array of the menu options to generate the options.
     * @param {JSON} config The configuration for the options.
     */
    constructor(scene, menuStr, config){
        this.scene = scene;
        this.menuStr = menuStr;
        this.config = {
            xOffset: 0,
            yOffset: 0,
            lineSpace: 100,
            fontSize: 32
        }

        if(config){
            for(let option in config){
                this.config[option] = config[option];
            }
        }
        
        this.menuOptions = {};

        this.optionsMaxWidth = 0;

        for(let [i, option] of menuStr.entries()){
            this.menuOptions[option] = this.scene.add.dynamicBitmapText(canvasSize.width/2 + this.config.xOffset, this.config.yOffset + i*this.config.lineSpace, "doomSFont", option);
            this.menuOptions[option].setFontSize(this.config.fontSize);
            this.menuOptions[option].setOrigin(0.5, 0);

            if(this.menuOptions[option]._bounds.lines.longest > this.optionsMaxWidth){
                this.optionsMaxWidth = this.menuOptions[option]._bounds.lines.longest
            }
        }
    }

    destroy(){
        for(let option of this.menuStr){
            this.menuOptions[option].destroy();
        }
    }
}