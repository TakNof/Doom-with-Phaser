/**
 * This class extends to @param Sprite class, due the "ilving" sprites count with
 * some diferente properties then the "not-living" ones.
 */
class Living extends Sprite{
    /**
    * The constructor of Living Class.
    * @constructor
    * @param {Scene} scene The current scene of the game to place the sprite.
    * @param {number[]} originInfo  A list with the initial positioning information for the sprite.
    * @param {string} spriteImgStr An str of the image name given in the preload method of the main class.
    * @param {number}size The size of the sprite in pixels.
    * @param {number} depth The depth of rendering of the sprite.
    * @param {number} defaultVelocity The default velocity for the living sprite.
    * 
    */
    constructor(scene, originInfo, spriteImgStr, size, depth, defaultVelocity){
        super(scene, originInfo, spriteImgStr, size, depth);

        this.defaultVelocity = defaultVelocity;

        this.scene.physics.add.existing(this.sprite, false);
        this.sprite.body.setSize(this.size, this.size, true);
        this.sprite.body.setAllowRotation(true);
        this.sprite.body.setCollideWorldBounds(true);
    }

    /**
     * Sets the velocity in the X component of the living sprite.
     * @param {number} value
     */
    set setVelocityX(value){
        this.sprite.body.setVelocityX(value);
    }

    /**
     * Gets the velocity in the X component of the living sprite.
     * @returns {number}
     */
    get getVelocityX(){
        return this.sprite.body.velocity.x;
    }

    /**
     * Sets the velocity in the Y component of the living sprite.
     * @param {number} value
     */
    set setVelocityY(value){
        this.sprite.body.setVelocityY(value);
    }

    /**
     * Gets the velocity in the Y component of the living sprite.
     * @returns {number}
     */
    get getVelocityY(){
        return this.sprite.body.velocity.y;
    }

    /**
     * Sets the velocity in both axis of the living sprite.
     * @param {number} value
     */
    set setVelocity(value){
        this.setVelocityX = value;
        this.setVelocityY = value;
    }

    /**
     * Sets the rotation of the living sprite.
     * @param {number} value
     */
    set setRotation(value){
        this.sprite.rotation = value;
    }

    /**
     * Gets the rotation of the living sprite.
     * @returns {number}
     */
    get getRotation(){
        return this.sprite.rotation;
    }

    /**
     * Sets the X component of the velocity according to the rotation stablished of the living sprite.
     */
    setXcomponent(){
        this.Xcomponent = Math.cos(this.sprite.rotation + Math.PI/2) * -this.defaultVelocity;
    }

    /**
     * Gets the X component of the velocity according to the rotation stablished of the living sprite.
     * @returns {number}
     */
    get getXcomponent(){
        return this.Xcomponent;
    }

    /**
     * Sets the Y component of the velocity according to the rotation stablished of the living sprite.
     */
    setYcomponent(){
        this.Ycomponent = Math.sin(this.sprite.rotation + Math.PI/2) * -this.defaultVelocity;
    }

    /**
     * Gets the Y component of the velocity according to the rotation stablished of the living sprite.
     * @returns {number}
     */
    get getYcomponent(){
        return this.Ycomponent;
    }

    setRaycaster(raysAmount, angleOffset = 0) {
        this.raysAmount = raysAmount;
        this.raycaster = new Raycaster(this.getRotation + angleOffset, this.getPositionX, this.getPositionY, raysAmount);
    }

    get getRaycaster(){
        return this.raycaster;
    }

    setRayData(){
        this.rayData = this.raycaster.calculateRayData();
    }

    get getRayData(){
        return this.rayData;
    }

    /**
     * Allows to adjust the angle value of the rotation to be within the range of 0 and 2PI.
     */
    adjustAngleValue(){
        if(this.sprite.rotation < 0){
            this.sprite.rotation += 2*Math.PI;
        }else if(this.sprite.rotation > 2*Math.PI){
            this.sprite.rotation -= 2*Math.PI;
        }
    }
}