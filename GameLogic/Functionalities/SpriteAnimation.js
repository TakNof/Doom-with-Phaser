class SpriteAnimation{
    /**
     * The constructor of the animation class.
     * @param {Scene} scene 
     * @param {String} spriteName 
     */
    constructor(scene, spriteName){
        this.scene = scene;
        this.spriteName = spriteName;

        this.setAnimationName();
    }

    /**
     * Sets the animation frames to animate the sprite sheet.
     * @param {Number} end
     * @param {Number} framerate
     * @param {Number} repeat
     */
    setAnimationFrames(end, framerate, repeat = 0){
        this.scene.anims.create({
            key: this.getAnimationName(),
            frames: this.scene.anims.generateFrameNames(this.spriteName, {
                start: 0,
                end: end,
                prefix: this.spriteName + "_",
                suffix: ".png"
            }),
            frameRate: framerate,
            repeat: repeat
        });
    }

    /**
     * Sets the animation name.
     */
    setAnimationName(){
        this.animationName = this.spriteName + "Animation";
    }

    /**
     * Gets the animation name.
     * @returns {String}
     */
    getAnimationName(){
        return this.animationName;
    }
}