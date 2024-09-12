/**
* This class extends to Sprite class, due the "Entities" sprites can interact 
* with other elemnts within the world.
*/
class Entity extends Sprite{
    /**
    * The constructor of Entity Class.
    * @constructor
    * @param {Phaser.Scene} scene The scene to place the sprite in the game.
    * @param {{x: Number, y: Number}} worldOriginInfo A literal Object with the initial positioning information for the sprite.
    * @param {String} spriteImgStr An str of the image name given in the preload method of the main class.
    * 
    */
    constructor(scene, worldOriginInfo, spriteImgStr){
        super(scene, worldOriginInfo, spriteImgStr);
        this.name = spriteImgStr; 
    }
    
    /**
     * Sets the sprite sounds to be played.
     * @param {String} name
     * @param {Array<String>} soundNames
     */
    setSpriteSounds(name, ...soundNames){
        this.spriteSounds = {};
        
        if(Array.isArray(soundNames[0])){
            soundNames = soundNames[0];
        }
 
        for(let element of soundNames){
         this.spriteSounds[element] = new Sound(this.getScene(), `${name}_${element}`);
        }
    }
 
    /**
     * Gets the sprite sound specified by the given name.
     * @param {String} element The name of the sound to retrieve.
     * @returns {Sound}
     */
    getSpriteSounds(element){
        if(!element){
            return this.spriteSounds;
        }else{
            let filteredKeys = Object.keys(this.spriteSounds).filter(key => key.includes(element));

            if (filteredKeys.length === 0) {
                return null;
            }

            if(filteredKeys.length === 1){
                return this.spriteSounds[element];
            }
        
            let randomKey = filteredKeys[Phaser.Math.Between(0, filteredKeys.length - 1)];
            return this.spriteSounds[randomKey];
        }
    }

    updateSoundPaning(){
        for(let element in this.spriteSounds){
            let soundObj = this.spriteSounds[element];
            if (soundObj.sound.isPlaying) {
                soundObj.calcSoundPanning(this);
            }
        }
    }
 
    /**
     * Sets the animations of the living element.
     * @param {Array<String>} animationsArray 
     */
    setSpriteAnimations(animationsArray){
    this.animations = {};

    if(!animationsArray) return;
    for(let animation of animationsArray){
        let fullNameAnim = this.getSpriteImgStr().includes(animation.name) ? this.getSpriteImgStr() : `${this.getSpriteImgStr()}_${animation.name}`;
        this.animations[animation.name] = fullNameAnim;
        
        if(!this.scene.anims.anims.entries[fullNameAnim]){
            this.scene.anims.create({
                key: fullNameAnim,
                frames: this.scene.anims.generateFrameNames(fullNameAnim, {
                    start: 0,
                    end: animation.animationParams.end,
                    prefix: fullNameAnim + "_",
                }),
                frameRate: animation.animationParams.framerate,
                repeat: animation.animationParams.repeat
            });
        }
    }
    }
     
     /**
      * 
      * @param {String} animation 
      * @returns animationName
      */
    getSpriteAnimations(animation){
        if(!animation){
            return this.animations;
        }else{
            let filteredKeys = Object.keys(this.animations).filter(key => key.includes(animation));

            if (filteredKeys.length === 0) {
                return null;
            }

            if(filteredKeys.length === 1){
                return this.animations[animation];
            }
        
            let randomKey = filteredKeys[Phaser.Math.Between(0, filteredKeys.length - 1)];
            return this.animations[randomKey];
        }
    }
  }