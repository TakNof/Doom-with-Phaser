class Sound{
    constructor(scene, key){
        this.scene = scene;
        this.key = key;
        this.sound = this.scene.sound.add(key);
    }

    playSound(){
        this.sound.play();
    }

    calcSoundPanning(emitter) {
        const { player } = this.scene;
        const playerToEmitterAngle = Phaser.Math.Angle.BetweenPoints(player.getPosition(), emitter.getPosition());
        const playerToEmitterDistance = Phaser.Math.Distance.BetweenPoints(player.getPosition(), emitter.getPosition());
        const angleAdjustedFromPlayer = adjustAngleValue(playerToEmitterAngle - player.getRotation() - player.config.angleOffset);
        
        const isFront = angleAdjustedFromPlayer >= 0 && angleAdjustedFromPlayer <= Math.PI;
        const pan = isFront 
            ? this.cuadInterpolation(angleAdjustedFromPlayer, 0, Math.PI) 
            : -this.cuadInterpolation(angleAdjustedFromPlayer, Math.PI, 2 * Math.PI);
        
        this.sound.setPan(pan);
        this.sound.setVolume(this.linInterpolation(playerToEmitterDistance, 0, 1000, 1, 0));
    }
    
    stopSound(){
        this.sound.stop();
    }

    linInterpolation(input, minInput, maxInput, minOutput, maxOutput){   
        let output = minOutput + ((input - minInput) / (maxInput - minInput)) * (maxOutput - minOutput);
        return output;
    }

    cuadInterpolation(input, minValue, maxValue){
        let t = (input - minValue) / maxValue;
        return 4 * t * (1 - t);
    }
}