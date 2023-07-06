class Sound{
    constructor(scene, key){
        this.scene = scene;
        this.key = key;

        this.sound = this.scene.sound.add(key);
    }

    
    setSoundPanning(distanceToPlayer, playerToEnemyAngle, playerAngle){
        let x;
        if(isNaN(playerToEnemyAngle)){
            x = 0;
        }else{
            playerToEnemyAngle = adjustAngleValue(playerToEnemyAngle);

            let angleAdjustedFromPlayer = adjustAngleValue(playerToEnemyAngle - playerAngle);
            
            x = Math.cos(angleAdjustedFromPlayer) * distanceToPlayer;
        }

        if(x == 0){
            x = canvasSize.width/2;
        }else{
            x += canvasSize.width/2;
        }

        this.sound.setPan(Phaser.Math.Linear(-1, 1, x / canvasSize.width));
    }

    playSound(){
        this.sound.play();
    }
}