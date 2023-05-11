class HUD{
    constructor(scene, canvasSize, enemies = undefined) {
        this.scene = scene;
        this.canvasSize = canvasSize;

        this.style = {font: "bold 48px Impact", fill: colors.limeGreen.replace("0x", "#"), backgroundColor: colors.DarkGreen.replace("0x", "#")};
        this.style2 = {font: "bold 100px Impact", fill: colors.limeGreen.replace("0x", "#"), backgroundColor: colors.DarkGreen.replace("0x", "#")};
        this.healthValue = this.scene.add.text(this.canvasSize.width - 140, 1.01*this.canvasSize.height, "", this.style).setDepth(80);
        
        this.setEnemiesHealthArray = enemies;
    }

    /**
     * Sets the text of the HUD health indicator.
     * @param {Number} value
     */
    set setHealthValue(value){
        this.healthValue.setText(`${value.toFixed(1)}%`);        
    }

    /**
     * Sets the text of the HUD enemy health indicator. 
     * @param {Enemy[]} enemies 
     */
    set setEnemiesHealthArray(enemies){
        if(enemies !== undefined){
            if(Array.isArray(enemies)){
                this.enemiesLength = enemies.length;
            }else{
                this.enemiesLength = 1;
            }

            this.enemiesHealthValue = Array(this.enemiesLength);
            for(let i = 0; i < this.enemiesLength; i++){
                this.enemiesHealthValue[i] = this.scene.add.text(0, 0, "", this.style).setDepth(80);
            }
        }
    }

    /**
     * Sets array of text of the HUD enemy health indicator. 
     * @param {Enemy[]} enemies 
     */
    set setEnemiesHealthValue(enemies){
        for(let i = 0; i < this.enemiesLength; i++){
            if(enemies[i].getEnemy3D.getPositionX >= 0  && enemies[i].getEnemy3D.getPositionX <= this.canvasSize.width){
                this.enemiesHealthValue[i].setVisible(true);
                this.enemiesHealthValue[i].x = enemies[i].getEnemy3D.getPositionX;
                this.enemiesHealthValue[i].y = enemies[i].getEnemy3D.getPositionY;
                this.enemiesHealthValue[i].setText(`${enemies[i].getHealth.toFixed(1)}%\n${Math.round(enemies[i].getDistanceToPlayer)}`);           
            }else{
                this.enemiesHealthValue[i].setVisible(false);
            }
        }
    }

    /**
     * Gets array of text of the hHUD enemy health indicator.
     * @returns {Enemy[]}
     */
    get getEnemiesHealthValue(){
        return this.enemiesHealthValue;
    }

    displayDeathText(){
        this.scene.add.text(this.canvasSize.width, 1.5*this.canvasSize.height, "HAS MUERTO", this.style2).setDepth(80);
    }

}