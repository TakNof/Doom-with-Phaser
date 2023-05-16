/**
 * This class extends to @param Sprite class, due the "living" sprites count with
 * some diferente properties then the "not-living" ones.
 */
class Living extends Sprite{
    /**
    * The constructor of Living Class.
    * @constructor
    * @param {Scene} scene The current scene of the game to place the sprite.
    * @param {Object} originInfo  A list with the initial positioning information for the sprite.
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

        this.lastShotTimer = 0;

        this.isAlive = true;

        this.ableToShoot = true;
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
     * Gets the default velocity of the living sprite.
     * @returns {number}
     */
    get getDefaultVelocity(){
        return this.defaultVelocity;
    }

    /**
     * Sets the rotation of the living sprite.
     * @param {number} value
     */
    set setRotation(value){
        this.sprite.rotation = this.adjustAngleValue(value);
    }

    /**
     * Gets the rotation of the living sprite.
     * @returns {number}
     */
    get getRotation(){
        return this.sprite.rotation;
    }

    /**
     * Sets the angle of the Living sprite.
     * @param {number} value
     */
    set setAngle(value){
        this.angle = value;
    }

    /**
     * Gets the angle of the Living sprite.
     */
    get getAngle(){
        return this.angle;
    }

    /**
     * Sets the angle offset of the Living sprite.
     * @param {number} value
     */
    set setAngleOffset(value){
        this.angleOffset = value;
    }

    /**
     * Gets the angle of the Living sprite.
     * @return {number}
     */
    get getAngleOffset(){
        return this.angleOffset;
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

    /**
     * This method created the raycaster object of the sprite.
     * @param {number} raysAmount The amount of rays that the raycaster should calculate.
     * @param {number} angleOffset The angle offset of the projected rays from the sprite.
     */
    setRaycaster(wallMatrix, raysAmount, angleOffset = 0) {
        this.raysAmount = raysAmount;
        this.setAngleOffset = angleOffset;
        this.raycaster = new Raycaster(this.getRotation + angleOffset, this.getPositionX, this.getPositionY, raysAmount);
        this.raycaster.setMatrix = wallMatrix;
    }

    /**
     * Gets the raycaster object of the sprite.
     * @returns {Raycaster}
     */
    get getRaycaster(){
        return this.raycaster;
    }

    /**
     * Sets the raydata through the raycaster object.
     */
    setRayData(){
        this.rayData = this.raycaster.calculateRayData();
    }

    /**
     * Gets the ray data calculated through the raycaster object.
     * @returns {Array}
     */
    get getRayData(){
        return this.rayData;
    }

    /**
     * This method sets the graphical representation of the rays thrown by the raycaster.
     * @param {String} colorOfRays The color of the rays.
     */
    setSpriteRays(colorOfRays){
        if(this.getDebug){
            this.spriteRays = new Rays(this.scene, this.raysAmount, this.getPosition, colorOfRays);
            this.spriteRays.setInitialRayAngleOffset = this.getAngleOffset;
        }
    }

    /**
     * Gets the graphical representation of the rays thrown by the raycaster.
     * @returns {Rays}
     */
    get getSpriteRays(){
        return this.spriteRays;
    }

    /**
     * Sets the elements to collide with.
     */
    setColliderElements(){
        if(this.getSpriteRays === undefined){
            this.colliderElements = this.getSprite;
        }else{
            this.colliderElements = [...[this.getSprite], ...this.getSpriteRays.rays];
        }
    }

    /**
     * Gets the elements to collide with.
     * @returns {Array}
     */
    get getColliderElements(){
        return this.colliderElements;
    }
    
    /**
     * This method stablishes the angle of the living sprite respect to an element.
     * @param {number} elementPosition The position of an element.
     */
    set setAngleToElement(elementPosition){
        if(this.getPositionX > elementPosition.x){
            this.angleToElement = Math.atan((this.getPositionY - elementPosition.y)/(this.getPositionX - elementPosition.x)) + Math.PI;
        }else{
            this.angleToElement = Math.atan((this.getPositionY - elementPosition.y)/(this.getPositionX - elementPosition.x))
        }

        this.angleToElement = this.adjustAngleValue(this.angleToElement);
    }

    /**
     * Gets the angle of the living sprite relative to an Element.
     * @return {number}
     */
    get getAngleToElement(){
        return this.angleToElement;
    }

    /**
     * Sets the max health of the living sprite.
     * @param {Number} maxHealth
     */
    set setMaxHealth(maxHealth){
        this.maxHealth = maxHealth;
        this.setHealth = maxHealth;
    }

    /**
     * Gets the max health of the living sprite.
     * @returns {Number}
     */
    get getMaxHealth(){
        return this.maxHealth;
    }

    /**
     * Sets the current health of the living sprite.
     * @param {Number} health
     */
    set setHealth(health){
        this.health = health;
    }

    /**
     * Gets the current health of the living sprite.
     */
    get getHealth(){
        return this.health;
    }

    /**
     * 
     * @param {Number} healValue 
     */
    heal(healValue){
        if(this.getHealth != this.maxHealth){
            if(this.getHealth+ healValue > this.maxHealth){
                this.setHealth = this.maxHealth;
            }else{
                this.setHealth = this.getHealth + healValue;
                this.playHealSound();
            }
        }
    }

    set setHurtSound(key){
        this.soundEffectName = this.scene.sound.add(key);
    }

    /**
     * Sets the alive state of the Living Sprite.
     * @param {boolean} state
     */
    set setIsAlive(state){
        this.isAlive = state;
    }

    /**
     * Gets the alive state of the Living Sprite.
     * @param {boolean} 
     */
    get getIsAlive(){
        return this.isAlive;
    }

     /**
     * Sets the alive state of the Living Sprite.
     * @param {boolean} state
     */
     set setAbleToShoot(state){
        this.ableToShoot = state;
    }

    /**
     * Gets the alive state of the Living Sprite.
     * @param {boolean} 
     */
    get getAbleToShoot(){
        return this.ableToShoot;
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

    /**
     * This method calculates the distance between 2 coordinates.
     * @param {number} x1 The x coordinate of the first sprite.  
     * @param {number} x2 The x coordinate of the second sprite. 
     * @param {number} y1 The y coordinate of the first sprite. 
     * @param {number} y2 The y coordinate of the second sprite. 
     * @returns {number} The hyphypotenuse according to the specified coordinates.
     */
    hypoCalc(x1, x2, y1, y2){
        return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
    }
}