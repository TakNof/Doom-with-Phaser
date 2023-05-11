class Projectile extends Living{
    
    /**
    * The constructor of Projectile Class.
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
        super(scene, originInfo, spriteImgStr, size, depth, defaultVelocity);
        
        this.getSprite.body.onWorldBounds = true;
        this.getSprite.body.world.on('worldbounds', function(body) {
            if (body.gameObject === this.getSprite) {
                this.getSprite.destroy();
            }
        }, this);
    }

    /**
     * This method allos to shoot the projectile.
     * @param {Living} livingSprite 
     */
    shootProjectile(livingSprite){
        this.setPositionX = livingSprite.getPositionX;
        this.setPositionY = livingSprite.getPositionY;

        this.getSprite.setActive(true);
        this.getSprite.setVisible(true);

        this.setRotation = livingSprite.getRotation;
        this.setXcomponent();
        this.setYcomponent();
        this.setVelocityX = this.getXcomponent;
        this.setVelocityY = this.getYcomponent;
    }
}