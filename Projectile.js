class Projectile extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, key){
        super(scene, x, y, key);
    }

    /**
     * This method allows to shoot the projectile.
     * @param {Living} livingSprite
     * @param {Number} velocity
     */
    shoot(livingSprite, velocity){
        this.setActive(true);
        this.setVisible(true);

        this.body.reset(livingSprite.getPositionX, livingSprite.getPositionY);        
        
        this.setXcomponent(livingSprite, velocity);
        this.setYcomponent(livingSprite, velocity);
        this.body.setVelocityX(this.getXcomponent);
        this.body.setVelocityY(this.getYcomponent);
    }

    /**
     * Sets the X component of the velocity according to the rotation stablished of the living sprite.
     * @param {Living} livingSprite
     * @param {Number} velocity
     */
    setXcomponent(livingSprite, velocity){
        this.Xcomponent = Math.cos(livingSprite.getRotation + livingSprite.getOriginInfo.angleOffset) * velocity;
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
     * @param {Living} livingSprite
     * @param {Number} velocity
     */
    setYcomponent(livingSprite, velocity){
        this.Ycomponent = Math.sin(livingSprite.getRotation + livingSprite.getOriginInfo.angleOffset) * velocity;
    }

    /**
     * Gets the Y component of the velocity according to the rotation stablished of the living sprite.
     * @returns {number}
     */
    get getYcomponent(){
        return this.Ycomponent;
    }
}