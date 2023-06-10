class HUD{
    /**
     * The constructor of the HUD class.
    * @param {Scene} scene The scene to place the HUD elements in the game.
     * @param {Array <Enemy>} enemies An array of the enemies to place their stats in the HUD.
     */
    constructor(scene, enemies = undefined) {
        this.scene = scene;

        this.style = {font: "bold 48px Impact", fill: colors.limeGreen.replace("0x", "#"), backgroundColor: colors.DarkGreen.replace("0x", "#")};

        this.deathStyle = {font: "bold 200px Impact", fill: colors.crimsonRed.replace("0x", "#"), backgroundColor: colors.black.replace("0x", "#")};
        this.victoryStyle = {font: "bold 200px Impact", fill: colors.DarkGreen.replace("0x", "#"), backgroundColor: colors.limeGreen.replace("0x", "#")};

        this.healthValue = this.scene.add.text(canvasSize.width - 280, 0.01*canvasSize.height, "", this.style).setDepth(80);

        this.deathText = this.scene.add.text(-canvasSize.width/2, -canvasSize.height, "YOU DIED", this.deathStyle).setDepth(80);
        this.victoryText = this.scene.add.text(-canvasSize.width/2, -canvasSize.height, "YOU WON", this.victoryStyle).setDepth(80);

        this.deathText.setOrigin(0.5);
        this.victoryText.setOrigin(0.5);

        this.hurtDamageRedScreen = this.scene.add.rectangle(canvasSize.width/2, 0.5*canvasSize.height, canvasSize.width, canvasSize.height, colors.crimsonRed, 0).setDepth(80);
        this.healDamageRedScreen = this.scene.add.rectangle(canvasSize.width/2, 0.5*canvasSize.height, canvasSize.width, canvasSize.height, colors.limeGreen, 0).setDepth(80);

        this.setEnemiesHealthArray = enemies;
    }

    /**
     * Sets the text of the HUD health indicator.
     * @param {Number} value
     */
    set setHealthValue(value){
        this.healthValue.setText(`Health ${value.toFixed(1)}%`);        
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
                this.enemiesHealthValue[i].setOrigin(0.5);
            }
        }
    }

    /**
     * Sets array of text of the HUD enemy health indicator. 
     * @param {Enemy[]} enemies 
     */
    set setEnemiesHealthValue(enemies){
        for(let i = 0; i < this.enemiesLength; i++){
            if(enemies[i].getEnemy3D.getPositionX >= 0  && enemies[i].getEnemy3D.getPositionX <= canvasSize.width){
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
       this.deathText.x = canvasSize.width/2;
       this.deathText.y = canvasSize.height*0.2;
       this.deathText.setOrigin(0.5);
        
    }

    displayVictoryText(){
        this.victoryText.x = canvasSize.width/2;
        this.victoryText.y = canvasSize.height*0.2;
        this.victoryText.setOrigin(0.5);
        
    }

    displayHurtRedScreen(){
        this.hurtDamageRedScreen.fillAlpha = 0.2;
        setTimeout(()=>{
            this.hurtDamageRedScreen.fillAlpha = 0;
        },200)
    }

    displayHealRedScreen(){
        this.healDamageRedScreen.fillAlpha = 0.2;
        setTimeout(()=>{
            this.healDamageRedScreen.fillAlpha = 0;
        },200)
    }

    displayScoreText(type, score){
        let currentStyle;
        switch (type) {
            case "Victory":
                currentStyle = this.victoryStyle;
                break;
            case "Defeat":
                currentStyle = this.deathStyle;
                break;

            default:
                throw new Error("Invalid type: " + type);
        }

        if(!this.scoreText){
            let iterations = 0;
            for(let typeScore in score){
                if(typeScore === "totalScore"){
                    this.scoreText = this.scene.add.text(canvasSize.width/2, 80*iterations+300, `YOUR SCORE: ${score[typeScore]}`, currentStyle).setDepth(80);
                    this.scoreText.setStyle({fontSize: "40px"});
                    this.scoreText.setOrigin(0.5);
                }else{
                    let specifiedScore = this.scene.add.text(canvasSize.width/2, 80*iterations+300, `${score[typeScore]}`, currentStyle).setDepth(80);
                    specifiedScore.setStyle({fontSize: "32px"});
                    specifiedScore.setOrigin(0.5);
                }
                iterations += 1;
            }
        }
    }
}