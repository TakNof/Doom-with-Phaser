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
     * Sets the sprite of the projectile which will be its representation in 3D camera.
     * @param {number} positionX 
     * @param {number} positionY 
     * @param {String} projectileImgStr 
     * @param {boolean} visible 
     */
    setProjectile3D(scene3D, positionX, positionY, ProjectileImgStr, visible = false){
        this.sprite3D = new Sprite(scene3D, {x: positionX, y: positionY}, ProjectileImgStr, this.getSize, 3)
        this.sprite3D.setVisible = visible;
    }

    /**
     * Gets the sprite of the Projectile which will be its representation in 3D camera.
     */
    get getProjectile3D(){
        return this.sprite3D;
    }


    /**
     * This method allows to shoot the projectile.
     * @param {Living} livingSprite 
     */
    shootProjectile(livingSprite){
        this.setPositionX = livingSprite.getPositionX;
        this.setPositionY = livingSprite.getPositionY;

        this.getSprite.setActive(true);
        this.getSprite.setVisible(true);

        this.setRotation = livingSprite.getRotation;
        this.setXcomponent(livingSprite.getAngleOffset);
        this.setYcomponent(livingSprite.getAngleOffset);
        this.setVelocityX = this.getXcomponent;
        this.setVelocityY = this.getYcomponent;
    }
}