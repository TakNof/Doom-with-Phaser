/**
 * This class extends to Sprite class, due the "living" sprites count with
 * some diferente properties then the "not-living" ones.
 */
class Living extends Sprite{
    /**
    * The constructor of Living Class.
    * @constructor
    * @param {Phaser.Scene} scene2D The scene to place the 2D sprites in the game.
    * @param {{x: Number, y: Number, ang: Number}} originInfo A literal Object with the initial positioning information for the sprite.
    * @param {String} spriteImgStr An str of the image name given in the preload method of the main class.
    * @param {Number} depth The depth of rendering of the sprite.
    * @param {Number} size The size of the sprite in pixels.
    * @param {Number} defaultVelocity The default velocity for the living sprite.
    * 
    */
    constructor(scene, originInfo, spriteImgStr, depth, size, defaultVelocity){
        super(scene, originInfo, spriteImgStr, depth);

        this.defaultVelocity = defaultVelocity;

        scene.physics.add.existing(this, false);
        this.setSize(size, size, true);
        this.body.setAllowRotation(true);
        this.body.setCollideWorldBounds(true);

        this.setLastShotTimer(0);

        this.isAlive = true;

        this.ableToShoot = true;
    }

    /**
     * Gets the scene3D of the player.
     * @returns scene3D 
     */
    getScene3D(){
        return this.scene3D;
    }
    
    /**
     * Gets the size of the sprite.
     * @return {number}
     */
    getSize(){
        return this.body.size;
    }

    /**
     * Sets the timer of the last shot of the living sprite.
     * @param {Time} lastShotTimer
     */
    setLastShotTimer(lastShotTimer){
        this.lastShotTimer = lastShotTimer;
    }

    /**
     * Gets the timer of the last shot of the living sprite.
     * @return {Time} lastShotTimer
     */
    getLastShotTimer(){
        return this.lastShotTimer
    }    

    /**
     * Sets the velocity in the X component of the living sprite.
     * @param {number} value
     */
    setVelocityX(value){
        this.body.setVelocityX(value);
    }

    /**
     * Gets the velocity in the X component of the living sprite.
     * @returns {number}
     */
    getVelocityX(){
        return this.body.velocity.x;
    }

    /**
     * Sets the velocity in the Y component of the living sprite.
     * @param {number} value
     */
    setVelocityY(value){
        this.body.setVelocityY(value);
    }

    /**
     * Gets the velocity in the Y component of the living sprite.
     * @returns {number}
     */
    getVelocityY(){
        return this.body.velocity.y;
    }

    /**
     * Sets the velocity in both axis of the living sprite.
     * @param {number} value
     */
    setVelocity(value){
        this.setVelocityX(value);
        this.setVelocityY(value);
    }

    /**
     * Gets the default velocity of the living sprite.
     * @returns {number}
     */
    getDefaultVelocity(){
        return this.defaultVelocity;
    }

    /**
     * Sets the rotation of the living sprite.
     * @param {number} value
     */
    setRotation(value){
        this.rotation = adjustAngleValue(value);
    }

    /**
     * Gets the rotation of the living sprite.
     * @returns {number}
     */
    getRotation(){
        return this.rotation;
    }

    /**
     * Sets the angle of the Living sprite.
     * @param {number} value
     */
    setAngle(value){
        this.angle = value;
    }

    /**
     * Gets the angle of the Living sprite.
     */
    getAngle(){
        return this.angle;
    }

    /**
     * Sets the X component of the velocity according to the rotation stablished of the living sprite.
     * @param {Number} movementAdjustment
     */
    setXcomponent(movementAdjustment = 0){
        this.Xcomponent = Math.cos(this.getRotation() + movementAdjustment) * this.getDefaultVelocity();
    }

    /**
     * Gets the X component of the velocity according to the rotation stablished of the living sprite.
     * @returns {number}
     */
    getXcomponent(){
        return this.Xcomponent;
    }

    /**
     * Sets the Y component of the velocity according to the rotation stablished of the living sprite.
     * @param {Number} movementAdjustment
     */
    setYcomponent(movementAdjustment = 0){
        this.Ycomponent = Math.sin(this.getRotation() + movementAdjustment) * this.getDefaultVelocity();
    }

    /**
     * Gets the Y component of the velocity according to the rotation stablished of the living sprite.
     * @returns {number}
     */
    getYcomponent(){
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
        this.raycaster = new Raycaster(this.getRotation() + angleOffset, this.getPositionX(), this.getPositionY(), raysAmount);
        this.raycaster.setMatrix = wallMatrix;
    }

    /**
     * Gets the raycaster object of the sprite.
     * @returns {Raycaster}
     */
    getRaycaster(){
        return this.raycaster;
    }

    getRaysAmount(){
        return this.raysAmount;
    }

    /**
     * Sets the raydata through the raycaster object.
     */
    setRayData(){
        this.rayData = this.getRaycaster().calculateRayData();
    }

    /**
     * Gets the ray data calculated through the raycaster object.
     * @returns {Array}
     */
    getRayData(){
        return this.rayData;
    }

    /**
     * This method sets the graphical representation of the rays thrown by the raycaster.
     * @param {String} colorOfRays The color of the rays.
     */
    setSpriteRays(colorOfRays){
        if(this.getDebug){
            this.spriteRays = new Rays(this.getScene(), this.getRaysAmount(), this.getPosition(), colorOfRays);
            this.spriteRays.setInitialRayAngleOffset = this.getAngleOffset;
        }
    }

    /**
     * Gets the graphical representation of the rays thrown by the raycaster.
     * @returns {Rays}
     */
    getSpriteRays(){
        return this.spriteRays;
    }

    /**
     * Sets the elements to collide with.
     */
    setColliderElements(){
        if(this.getSpriteRays() === undefined){
            this.colliderElements = this;
        }else{
            this.colliderElements = [...[this], ...this.getSpriteRays().rays];
        }
    }

    /**
     * Gets the elements to collide with.
     * @returns {Array}
     */
    getColliderElements(){
        return this.colliderElements;
    }
    
    /**
     * This method stablishes the angle of the living sprite respect to an element.
     * @param {number} elementPosition The position of an element.
     */
    angleToElement(elementPosition){
        if(this.getPositionX() > elementPosition.x){
            return adjustAngleValue(Math.atan((this.getPositionY() - elementPosition.y)/(this.getPositionX() - elementPosition.x)) + Math.PI);
        }else{
            return adjustAngleValue(Math.atan((this.getPositionY() - elementPosition.y)/(this.getPositionX() - elementPosition.x)));
        }
    }

    /**
     * Sets the sprite sounds to be played.
     * @param {String} name
     * @param {Array<String>} soundNames
     */
    setSpriteSounds(name, soundNames){
        this.spriteSounds = {};

        for(let element of soundNames){
            this.spriteSounds[element] = new Sound(this.getScene(), `${name}_${element}_sound`);
        }
    }

    /**
     * Gets the sprite sound specified by the given name.
     * @param {String} element The name of the sound to retrieve.
     * @returns {Sound}
     */
    getSpriteSounds(element){
        return this.spriteSounds[element];
    }

    /**
     * Sets the max health of the living sprite.
     * @param {Number} maxHealth
     */
    setMaxHealth(maxHealth){
        this.maxHealth = maxHealth;
        this.setHealth(maxHealth);
    }

    /**
     * Gets the max health of the living sprite.
     * @returns {Number}
     */
    getMaxHealth(){
        return this.maxHealth;
    }

    /**
     * Sets the current health of the living sprite.
     * @param {Number} health
     */
    setHealth(health){
        this.health = health;
    }

    /**
     * Gets the current health of the living sprite.
     * @return {Number}
     */
    getHealth(){
        return this.health;
    }

    /**
     * 
     * @param {Number} healValue 
     */
    heal(healValue){
        if(this.getHealth() != this.getMaxHealth()){
            if(this.getHealth() + healValue > this.getMaxHealth()){
                this.setHealth(this.getMaxHealth());
            }else{
                this.setHealth(this.getHealth() + healValue);
                this.getSpriteSounds("heal").playSound();
                
                this.getHUD().setHUDElementValue("health", this.getHealth(), true, "%");
                this.getHUD().displayHealRedScreen();
            }
        }
    }

     /**
     * Sets the alive state of the Living Sprite.
     * @param {boolean} state
     */
    setAbleToShoot(state){
        this.ableToShoot = state;
    }

    /**
     * Gets the alive state of the Living Sprite.
     * @param {boolean} 
     */
    getAbleToShoot(){
        return this.ableToShoot;
    }
}