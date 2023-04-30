class Sprite{
    constructor(scene, originInfo, defaultVelocity, spriteImgStr){
        this.scene = scene;
        this.originInfo = {x: originInfo[0], y: originInfo[1], ang: originInfo[2]};
        this.defaultVelocity = defaultVelocity;

        this.sprite = scene.add.sprite(this.originInfo.x, this.originInfo.y, spriteImgStr);
    }    
}