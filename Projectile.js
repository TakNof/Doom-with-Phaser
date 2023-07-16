class Projectile extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, originInfo, spriteImgStr){
        super(scene, originInfo.x, originInfo.y, spriteImgStr);
    }
}

class ProjectileGroup extends Phaser.Physics.Arcade.Group{
    constructor(scene, projectileType, key){
        super(scene.physics.world, scene);
        this.createMultiple({
            classType: projectileType,
            frameQuantity: 10,
            active: false,
            visible: false,
            key: key
        })
    }
}