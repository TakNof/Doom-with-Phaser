class HUD{
    constructor(scene, canvasSize){
        this.scene = scene;
        this.canvasSize = canvasSize;

        const style = {font: "bold 48px Impact", fill: colors.limeGreen.replace("0x", "#"), backgroundColor: colors.DarkGreen.replace("0x", "#")};
        this.healthValue = this.scene.add.text(this.canvasSize.width - 140, 1.01*this.canvasSize.height, "", style).setDepth(80);
    }

    /**
     * Sets the text of the HUD health indicator.
     * @param {Number} value
     */
    set setHealthValue(value){
        this.healthValue.setText(`${value.toFixed(1)}%`);        
    }
    
}