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
    * @param depth The depth of rendering of the sprite.
    * @param defaultVelocity The default velocity for the  living sprite.
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
     * 
     */
    set setRotation(value){
        this.sprite.rotation = value;
    }

    get getRotation(){
        return this.sprite.rotation;
    }

    adjustAngleValue(){
        if(this.sprite.rotation < 0){
            this.sprite.rotation += 2*Math.PI;
        }else if(this.sprite.rotation > 2*Math.PI){
            this.sprite.rotation -= 2*Math.PI;
        }
    }
}