class Sprite{
    constructor(scene, originInfo, velocity, spriteImgStr){
        this.scene = scene;
        this.originInfo = {x: originInfo[0], y: originInfo[1], ang: originInfo[2]};
        this.velocity = velocity;

        this.sprite = scene.add.sprite(this.originInfo.x, this.originInfo.y, spriteImgStr);
    }    
}