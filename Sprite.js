/**
 * The sprite class will contain everything that a sprite needs to be placed into the website.
 */
class Sprite{
    /**
    * The constructor of Sprite Class.
    * @constructor
    * @param {Scene} scene The scene to place the 2D sprites in the game.
    * @param {{x: Number, y: Number, ang: Number}} originInfo  A list with the initial positioning information for the sprite.
    * @param {string} spriteImgStr An str of the image name given in the preload method of the main class.
    * @param {number} size The size of the sprite in pixels.
    * @param {number} depth The depth of rendering of the sprite.
    */
    constructor(scene, originInfo, spriteImgStr, size, depth){
        this.sprite = scene.add.sprite(originInfo.x, originInfo.y, spriteImgStr, 0).setDepth(depth);
        this.sprite.scene = scene;
        this.sprite.originInfo = originInfo;
        this.sprite.spriteImgStr = spriteImgStr;
        this.sprite.size = size;
        
        this.sprite.debug = false;
    }

    /**
     * Gets the scene of the sprite.
     * @return {Scene} The scene of the sprite.
     */
    get getScene(){
        return this.sprite.scene;
    }

    /**
     * Gets the sprite origin info.
     * @return {{x: number, y: number, ang:number}}
     */
    get getOriginInfo(){
        return this.sprite.originInfo;
    }

    /**
     * Gets the sprite image string.
     * @return {String} The image string of the sprite.
     */
    get getSpriteImgStr(){
        return this.sprite.spriteImgStr;
    }

    /**
     * Gets the sprite of the object.
     * @returns {Sprite}
     */
    get getSprite(){
        return this.sprite;
    }

    /**
     * Sets the size of the sprite.
     * @param {number} size
     */
    set setSize(size){
        this.sprite.size = size;
    }

    /**
     * Gets the size of the sprite.
     * @return {number}
     */
    get getSize(){
        return this.sprite.size;
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
        this.sprite.visible = visible;
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
        this.sprite.setDepth(value);
    }

    /**
     * Gets the depth of rendering of the sprite.
     * @returns {number}
     */
    get getDepth(){
        return this.sprite.getDepth();
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
        this.sprite.debug = value;
    }

    /**
     * Gets if the sprite should show the rays or not.
     * @returns {boolean}
     */
    get getDebug(){
        return this.sprite.debug;
    }
}