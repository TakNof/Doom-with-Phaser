class Sound{
    constructor(scene, key, canvasSize = undefined){
        this.scene = scene;
        this.key = key;

        this.canvasSize = canvasSize

        this.sound = this.scene.sound.add(key);
    }

    
    setSoundPanning(distanceToPlayer, playerToEnemyAngle, playerAngle){
        let x;
        if(isNaN(playerToEnemyAngle)){
            x = 0;
        }else{
            playerToEnemyAngle = this.adjustAngleValue(playerToEnemyAngle);

            let angleAdjustedFromPlayer = this.adjustAngleValue(playerToEnemyAngle - playerAngle);
            
            x = Math.cos(angleAdjustedFromPlayer) * distanceToPlayer;
        }

        if(x == 0){
            x = this.canvasSize.width/2;
        }else{
            x += this.canvasSize.width/2;
        }

        this.sound.setPan(Phaser.Math.Linear(-1, 1, x / this.canvasSize.width));
    }

    playSound(){
        this.sound.play();
    }

    /**
     * Allows to adjust the angle value of the rotation to be within the range of 0 and 2PI.
     * @param {Number} angle The angle to be within the range of 0 and 2PI.
     * @returns {Number}
     */
    adjustAngleValue(angle){
        if(angle < 0){
            angle += 2*Math.PI;
        }else if(angle > 2*Math.PI){
            angle -= 2*Math.PI;
        }

        return angle;
    }
}