/**
 * The sprite class will contain everything that a sprite needs to be placed into the website.
 */
class Sprite{
    /**
    * The constructor of Sprite Class.
    * @constructor
    * @param {Scene} scene The current scene of the game to place the sprite.
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
        this.spriteImgStr = spriteImgStr;
        this.size = size;
        this.depth = depth;
        this.sprite = scene.add.sprite(this.originInfo.x, this.originInfo.y, spriteImgStr, 0).setDepth(this.depth);

        this.debug = false;
    }

    /**
     * Gets the sprite of the object.
     * @returns {Sprite}
     */
    get getSprite(){
        return this.sprite;
    }

    /**
     * Gets the sprite name.
     * @returns {String}
     */
    get getSpriteImgStr(){
        return this.spriteImgStr;
    }

    /**
     * Sets the size of the sprite.
     * @param {number} size
     */
    set setSize(size){
        this.size = size;
    }

    /**
     * Gets the size of the sprite.
     * @return {number}
     */
    get getSize(){
        return this.size;
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
     * Gets the position in X and Y axis of the sprite.
     * @returns {number}
     */
    get getPosition(){
        return {x: this.sprite.x, y: this.sprite.y};
    }

    /**
     * Sets the visibility of the sprite.
     * @param {boolean} visible Whether the sprite is visible or not.
     */
    set setVisible(visible = true){
        this.visible = visible;
        this.sprite.visible = this.visible;
    }

    /**
     * Gets the visibility of the sprite.
     * @returns {boolean}
     */
    get getVisible(){
        return this.sprite.visible;
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

    /**
     * Sets the scale of the sprite along the X axis.
     * @param {number} value
     */
    set setScaleX(value){
        this.sprite.scaleX = value;
    }

    /**
     * Sets the scale of the sprite along the Y axis.
     * @param {number} value
     */
    set setScaleY(value){
        this.sprite.scaleY = value;
    }  
    
    /**
     * Sets if the sprite should show the rays or not.
     * @param {boolean} value
     */
    set setDebug(value){
        this.debug = value;
    }

    /**
     * Gets if the sprite should show the rays or not.
     * @returns {boolean}
     */
    get getDebug(){
        return this.debug;
    }
}