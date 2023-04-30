class Living extends Sprite{
    constructor(scene, originInfo, defaultVelocity, spriteImgStr, size){
        super(scene, originInfo, defaultVelocity, spriteImgStr);

        this.scene.physics.add.existing(this.sprite, false);
        this.sprite.body.setSize(size, size, true);
        this.sprite.body.setAllowRotation(true);
        this.sprite.body.setCollideWorldBounds(true);
    }
}