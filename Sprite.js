/**
 * The sprite class will contain everything that a sprite needs to be placed into the website.
 */
class Sprite{
    /**
    * The constructor of Sprite Class.
    * @param scene The current scene of the game to place the sprite.
    * @param originInfo  A list with the intial positioning information for the sprite.
    * @param spriteImgStr An str of the image name given in the preload method of the main class.
    * @param size The size of the sprite in pixels.
    * @param depth The depth of rendering of the sprite.
    */
    constructor(scene, originInfo, spriteImgStr, size, depth){
        this.scene = scene;
        this.originInfo = {x: originInfo[0], y: originInfo[1], ang: originInfo[2]};
        this.size = size;
        this.depth = depth;
        this.sprite = scene.add.sprite(this.originInfo.x, this.originInfo.y, spriteImgStr).setDepth(this.depth);
    }

    set setPositionX(value){
        this.sprite.x = value;
    }

    get getPositionX(){
        return this.sprite.x;
    }

    set setPositionY(value){
        this.sprite.y = value;
    }

    get getPositionY(){
        return this.sprite.y;
    }

    set setDepth(value){
        this.depth = value;
        this.sprite.setDepth(this.depth);
    }

    get getDepth(){
        return this.depth;
    }   
}