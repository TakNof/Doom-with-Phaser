class Projectile extends Sprite{
    constructor(scene, x, y, key, depth = 1){
        super(scene, {x: x, y: y}, key, depth);
    }

    /**
     * This method allows to shoot the projectile.
     * @param {Living} livingSprite
     * @param {Number} velocity
     */
    shoot(livingSprite, velocity){
        this.setActive(true);
        this.setVisible(true);
        this.setCollideWorldBounds(true);

        this.body.reset(livingSprite.getPositionX(), livingSprite.getPositionY());
        
        // this.body.onWorldBounds = true;
        // this.body.world.on('worldbounds', function(body) {
        //     if (body.gameObject === this) {
        //         this.destroy();
        //     }
        // }, this);
        
        this.setXcomponent(livingSprite, velocity);
        this.setYcomponent(livingSprite, velocity);
        this.body.setVelocityX(this.getXcomponent());
        this.body.setVelocityY(this.getYcomponent());
    }

    /**
     * Sets the X component of the velocity according to the rotation stablished of the living sprite.
     * @param {Living} livingSprite
     * @param {Number} velocity
     */
    setXcomponent(livingSprite, velocity){
        this.Xcomponent = Math.cos(livingSprite.getRotation() + livingSprite.getOriginInfo().angleOffset) * velocity;
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
     * @param {Living} livingSprite
     * @param {Number} velocity
     */
    setYcomponent(livingSprite, velocity){
        this.Ycomponent = Math.sin(livingSprite.getRotation() + livingSprite.getOriginInfo().angleOffset) * velocity;
    }

    /**
     * Gets the Y component of the velocity according to the rotation stablished of the living sprite.
     * @returns {number}
     */
    getYcomponent(){
        return this.Ycomponent;
    }
}

class ProjectileGroup extends Phaser.Physics.Arcade.Group{
    constructor(scene, key, maxAmount){
        super(scene.physics.world, scene);

        this.maxSize = maxAmount;

        this.createMultiple({
            classType: Projectile,
            key: key,
            quantity: maxAmount,
            active: false,
            visible: false
        });

        Phaser.Actions.SetXY(this.getChildren(), -100, -100);
    }
}