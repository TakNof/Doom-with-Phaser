class Living extends Sprite{
    constructor(scene, originInfo, velocity, spriteImgStr, size){
        super(scene, originInfo, velocity, spriteImgStr);

        this.scene.physics.add.existing(this.sprite, false);
        this.sprite.body.setSize(size, size, true);
        this.sprite.body.setAllowRotation(true);
        this.sprite.body.setCollideWorldBounds(true);
    }
}