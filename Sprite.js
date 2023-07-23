/**
 * The sprite class will contain everything that a sprite needs to be placed into the website.
 */
class Sprite extends Phaser.Physics.Arcade.Sprite{
    /**
    * The constructor of Sprite Class.
    * @param {Phaser.Scene} scene The scene to place the 2D sprites in the game.
    * @param {{x: Number, y: Number, ang: Number}} originInfo A literal Object with the initial positioning information for the sprite.
    * @param {String} spriteImgStr An str of the image name given in the preload method of the main class.
    * @param {Number} size The size of the sprite in pixels.
    * @param {Number} depth The depth of rendering of the sprite.
    */
    constructor(scene, originInfo, spriteImgStr, depth){
        super(scene, originInfo.x, originInfo.y, spriteImgStr);
        this.setDepth(depth);

        this.originInfo = originInfo;
        this.debug = false;
        scene.add.existing(this);
    }

    /**
     * Gets the scene of the sprite.
     * @return {Scene} The scene of the sprite.
     */
    getScene(){
        return this.scene;
    }

    /**
     * Sets if the sprite should show the rays or not.
     * @param {Boolean} value
     */
    setDebug(value){
        this.debug = value;
    }

    /**
     * Gets if the sprite should show the rays or not.
     * @returns {boolean}
     */
    getDebug(){
        return this.debug;
    }

    /**
     * Gets the sprite origin info.
     * @return {{x: number, y: number, angleOffset: number}}
     */
    getOriginInfo(){
        return this.originInfo;
    }

    /**
     * Gets the sprite image string.
     * @return {String} The image string of the sprite.
     */
    getSpriteImgStr(){
        return this.texture.key;
    }

    /**
     * Sets the position in X axis of the sprite.
     * @param {number} value
     */
    setPositionX(value){
        this.x = value;
    }

    /**
     * Gets the position in X axis of the sprite.
     * @returns {number}
     */
    getPositionX(){
        return this.x;
    }

    /**
     * Sets the position in Y axis of the sprite.
     * @param {number} value
     */
    setPositionY(value){
        this.y = value;
    }

    /**
     * Gets the position in Y axis of the sprite.
     * @returns {number}
     */
    getPositionY(){
        return this.y;
    }

    /**
     * Sets the position in X and Y axis of the sprite.
     * @param {Number} valueX
     * @param {Number} valueY
     */
    setPosition(valueX, valueY = valueX){
        this.setPositionX(valueX);
        this.setPositionY(valueY);
    }

    /**
     * Gets the position in X and Y axis of the sprite.
     * @returns {number}
     */
    getPosition(){
        return {x: this.x, y: this.y};
    }
    /**
     * Sets the visibility of the sprite.
     * @param {boolean} visible Whether the sprite is visible or not.
     */
    setVisible(visible = true){
        this.visible = visible;
    }

    /**
     * Gets the visibility of the sprite.
     * @returns {boolean}
     */
    getVisible(){
        return this.visible;
    }

    /**
     * Sets the scale of the sprite along the X axis.
     * @param {number} value
     */
    setScaleX(value){
        this.scaleX = value;
    }

    /**
     * Sets the scale of the sprite along the Y axis.
     * @param {number} value
     */
    setScaleY(value){
        this.scaleY = value;
    }  
}