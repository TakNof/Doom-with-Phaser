class Weapon extends Sprite{
    /**
    * The constructor of Weapons Class.
    * @constructor
    * @param {Scene} scene The current scene of the game to place the weapon sprite.
    * @param {number[]} originInfo  A list with the initial positioning information for the weapon sprite.
    * @param {string} weapon spriteImgStr An str of the image name given in the preload method of the main class.
    * @param {number}size The size of the weapon sprite in pixels.
    * @param {number} depth The depth of rendering of the weapon sprite.
    * 
    */
    constructor(scene, originInfo, spriteImgStr, size, depth,damagePerBullet){
        super(scene, originInfo, spriteImgStr, size, depth);

        this.defaultVelocity = defaultVelocity;
        this.damagePerBullet = damagePerBullet;

        this.setAnimationName();
        this.setSoundEffect();
        this.setProjectiles();
    }
    
    /**
     * Sets the animation frames to animate the sprite sheet.
     * @param {Number} start 
     * @param {Number} end 
     */
    setAnimationFrames(end, framerate, repeat){
        this.scene.anims.create({
            key: this.getAnimationName,
            frames: this.scene.anims.generateFrameNames(this.getSpriteImgStr, {
                start: 0,
                end: end,
                prefix: this.getSpriteImgStr+"_",
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
        this.animationName = this.getSpriteImgStr + "Animation";
    }

    /**
     * Gets the animation name.
     * @returns {String}
     */
    get getAnimationName(){
        return this.animationName;
    }

    /**
     * Sets the sound effect of the weapon.
     */
    setSoundEffect(){
        this.soundEffectName = this.scene.sound.add(this.getSpriteImgStr + "_sound");
    }

    playSoundEffect(){
        this.soundEffectName.play();
    }

    setProjectiles(){
        this.weaponProjectiles = this.scene.physics.add.group();
    }

    /**
     * Gets the weapon's projectiles.
     * @returns {Projectile}
     */
    get getProjectiles(){
        return this.weaponProjectiles;
    }

    get getDamagePerBullet(){
        return this.damagePerBullet;
    }
}