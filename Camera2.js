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
    }

    setPlayerGlobalAngle(){
        this.playerGlobalAngle = adjustAngleValue(this.playerGlobalAngle.getAngle);
    }

}