/**
 * The sprite class will contain everything that a sprite needs to be placed into the website.
 */
class Sprite{
    /**
    * The constructor of Sprite Class.
    * @param {scene} scene The current scene of the game to place the sprite.
    * @param {number[]} originInfo  A list with the initial positioning information for the sprite.
    * @param {string} spriteImgStr An str of the image name given in the preload method of the main class.
    * @param {number}size The size of the sprite in pixels.
    * @param {number} depth The depth of rendering of the sprite.
    */
    constructor(scene, originInfo, spriteImgStr, size, depth){
        if (originInfo.length !== 3) {
            throw new Error('La lista debe tener exactamente tres elementos.');
        }
        this.scene = scene;
        this.originInfo = {x: originInfo[0], y: originInfo[1], ang: originInfo[2]};
        this.size = size;
        this.depth = depth;
        this.sprite = scene.add.sprite(this.originInfo.x, this.originInfo.y, spriteImgStr).setDepth(this.depth);
    }


    /**
     * Sets the position in X axis of the sprite.
     * @param {number} value
     */
    set setPositionX(value){
        this.sprite.x = value;
    }

    /**
     * Gets the position in X axis of the sprite.
     * @returns {number}
     */
    get getPositionX(){
        return this.sprite.x;
    }

    /**
     * Sets the position in Y axis of the sprite.
     * @param {number} value
     */
    set setPositionY(value){
        this.sprite.y = value;
    }

    /**
     * Gets the position in Y axis of the sprite.
     * @returns {number}
     */
    get getPositionY(){
        return this.sprite.y;
    }

    /**
     * Sets the depth of rendering of the sprite.
     * @param {number} value
     */
    set setDepth(value){
        this.depth = value;
        this.sprite.setDepth(this.depth);
    }

    /**
     * Gets the depth of rendering of the sprite.
     * @returns {number}
     */
    get getDepth(){
        return this.depth;
    }   
}