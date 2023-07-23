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

        let elements = ["health", "ammo"];

        let iterations = 0;
        this.elements = {};
        for(let value of elements){
            this.elements[value] = new HUDText(this.scene, canvasSize.width - 280, 50*iterations+50, "", this.style, 80, {x: 0, y:1});
            iterations++;
        }
    
        this.healthValue = new HUDText(this.scene, canvasSize.width - 280, 0.01*canvasSize.height, "", this.style, 80, 0);

        this.deathText = new HUDText(this.scene, -canvasSize.width/2, -canvasSize.height, "YOU DIED", this.deathStyle, 80);
        this.victoryText = new HUDText(this.scene,-canvasSize.width/2, -canvasSize.height, "YOU WON", this.victoryStyle, 80);

        this.hurtDamageRedScreen = this.scene.add.rectangle(canvasSize.width/2, canvasSize.height/2, canvasSize.width, canvasSize.height, colors.crimsonRed, 0).setDepth(80);
        this.healDamageRedScreen = this.scene.add.rectangle(canvasSize.width/2, canvasSize.height/2, canvasSize.width, canvasSize.height, colors.limeGreen, 0).setDepth(80);

        this.setEnemiesHealthArray = enemies;
    }

    /**
     * Sets the text of the HUD health indicator.
     * @param {String} element The name of the HUD element to set the value.
     * @param {Number} value The value of the element indicator.
     * @param {Boolean} isFixed If the value needs to be fixed.
     * @param {String} extraFormat The string with extra formatting.
     */
    setHUDElementValue(element, value, isFixed, extraFormat = ""){
        element = element.toLowerCase();
        if(isFixed){
            value = value.toFixed(1);
        }

        this.elements[element].setText(`${element.charAt(0).toUpperCase() + element.slice(1)} ${value}${extraFormat}`);        
    }

    /**
     * Sets the text of the HUD enemy health indicator. 
     * @param {Enemy[]} enemies 
     */
    setEnemiesHealthArray(enemies){
        if(enemies !== undefined){
            if(Array.isArray(enemies)){
                this.enemiesLength = enemies.length;
            }else{
                this.enemiesLength = 1;
            }

            this.enemieselem = Array(this.enemiesLength);
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
    setEnemiesHealthValue(enemies){
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
    getEnemiesHealthValue(){
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
        if(!this.scoreText){
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
            let iterations = 0;
            for(let typeScore in score){
                if(typeScore === "totalScore"){
                    this.scoreText = new HUDText(this.scene, canvasSize.width/2, 80*iterations+300, `YOUR SCORE: ${score[typeScore]}`, currentStyle, 80);
                    this.scoreText.setStyle({fontSize: "40px"});
                }else{
                    let specifiedScore = new HUDText(this.scene, canvasSize.width/2, 80*iterations+300, `${score[typeScore]}`, currentStyle, 80);
                    specifiedScore.setStyle({fontSize: "32px"});
                }
                iterations ++;
            }
        }
    }
}

class HUDText extends Phaser.GameObjects.Text{
    /**
     * Text generator for the HUD.
     * @param {Phaser.Scene} scene The current scene.
     * @param {Number} x The x position to place the text.
     * @param {Number} y The y position to place the text.
     * @param {String} text The string to fill the text with.
     * @param {Phaser.Types.GameObjects.Text.TextStyle} style The style object to use for the text.
     * @param {Number} depth The depth to place the text at.
     * @param {{x: Number, y: Number} | {both: Number}} origin The origin anchor to place the text at.
     */
    constructor(scene, x, y, text, style, depth = 0, origin = {both: 0.5}){
        super(scene, x, y, text, style);
        
        this.setDepth(depth);

        if(origin.both){
            this.setOrigin(origin.both);
        }else{
            this.originX = origin.x;
            this.originY = origin.y;
        }
        
        scene.add.existing(this);
    }
}