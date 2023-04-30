/**
 * This class extends to @param Sprite class, due the "ilving" sprites count with
 * some diferente properties then the "not-living" ones.
 */
class Living extends Sprite{
    /**
    * The constructor ofLiving Class.
    * @param scene The current scene of the game to place the sprite.
    * @param originInfo  A list with the intial positioning information for the sprite.
    * @param spriteImgStr An str of the image name given in the preload method of the main class.
    * @param size The size of the sprite in pixels.
    * @param defaultVelocity The default velocity for the sprite.
    * 
    */
    constructor(scene, originInfo, spriteImgStr, size, defaultVelocity){
        super(scene, originInfo, spriteImgStr, size);

        this.defaultVelocity = defaultVelocity;

        this.scene.physics.add.existing(this.sprite, false);
        this.sprite.body.setSize(this.size, this.size, true);
        this.sprite.body.setAllowRotation(true);
        this.sprite.body.setCollideWorldBounds(true);
    }
}