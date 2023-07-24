class Camera2{
    /**
     * 
     * @param {Phaser.Scene} scene The scene to render the elements.
     * @param {Number} fov The field of view of the camera in radians.
     * @param {Player} player A player object from the Player Class.
     */
    constructor(scene, fov, player){
        this.scene = scene;
        
        this.fov = fov;
        this.player = player;
        this.setPlayerGlobalAngle();

        this.fovArcLenght = canvasSize.width;

        this.fovArcRadius = this.fovArcLenght/this.fov;
    }

    /**
     * Gets the radius of the fov arc.
     * @returns {Number} 
     */
    getFovArcRadius(){
        return this.fovArcRadius;
    }

    /**
     * Sets the angle of the player acording to the global angle of the world.
     * @returns {Number}
     */
    setPlayerGlobalAngle(){
        this.playerGlobalAngle = adjustAngleValue(this.player.getAngleRadians() + this.player.getOriginInfo().angleOffset);
        this.setArcAngles();
    }

    /**
     * Gets the global angle of the player.
     * @returns {Number}
     */
    get getPlayerGlobalAngle(){
        return this.playerGlobalAngle;
    }

    /**
     * Sets the angles of the fov arc to make the graphication.
     */
    setArcAngles(){
        this.arcAngles = {
            x0: this.adjustAngleValue(this.playerGlobalAngle - this.fov/2),
            x1024:this.adjustAngleValue(this.playerGlobalAngle + this.fov/2)
        };
    }

    /**
     * Gets the angles of the fov arc to make the graphication.
     * @returns {Number}
     */
    getArcAngles(){
        return this.arcAngles;
    }

}