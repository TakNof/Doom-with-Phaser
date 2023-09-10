class Weapon extends Sprite{
    /**
    * The constructor of Weapons Class.
    * @constructor
    * @param {Phaser.Scene} scene The scene of the game to place bullets.
    * @param {Phaser.Scene} scene3D The current scene of the game to place the weapon sprite.
    * @param {{x: Number, y: Number, angleOffset: Number}} originInfo  A list with the initial positioning information for the weapon sprite.
    * @param {String} weapon spriteImgStr An str of the image name given in the preload method of the main class.
    * @param {Number} depth The depth of rendering of the weapon sprite.
    * @param {{damage: Number, velocity: Number, delay: Number, critical: Number}} bulletProperties 
    * The damage per bullet, the projectile velocity and the delay in seconds between the shots for the weapon sprite. 
    * @param {{min: Number, max: Number}} distanceLimits The minimum and maximum distance to deal damage concidering the distance to the object.    *  
    */
    constructor(scene, originInfo, spriteImgStr, depth, bulletProperties, distanceLimits, animationParams){
        super(scene, originInfo, spriteImgStr, depth);

        this.bulletProperties = bulletProperties;
        this.distanceLimits = distanceLimits;

        this.weaponShootingAnimation = new SpriteAnimation(this.getScene(), this.getSpriteImgStr());
        this.switchWeaponDelay = 1000;
        this.setSoundEffect();
        
        this.getShootingAnimation().setAnimationFrames(animationParams.end, animationParams.framerate, animationParams.repeat);

        this.switchWeaponSounds = Array(3);

        for(let i = 0; i < 3; i++){
            this.switchWeaponSounds[i] = new Sound(this.getScene(), `switch_weapon_sound_${i + 1}`);
        } 
    }

    /**
     * Sets the sound effect of the weapon.
     */
    setSoundEffect(){
        this.soundEffectName = this.getScene().sound.add(`${this.getSpriteImgStr()}_sound`);
    }

    /**
     * Plays the sound effect of the weapon.
     */
    playSoundEffect(){
        this.soundEffectName.play();
    }

    playSwitchWeaponSound(){
        let index = getRndInteger(0, 2);
        this.switchWeaponSounds[index].playSound();
    }

    /**
     * Sets the group of projectiles of the weapon.
     * @param {Scene} Scene2D The key of the sprite to make the group of projectiles.
     */
    setProjectiles(Scene2D){
        this.weaponProjectiles = new ProjectileGroup(Scene2D, "bullet", 10);
    }

    /**
     * Gets the weapon's projectiles.
     * @returns {Projectile}
     */
    getProjectiles(){
        return this.weaponProjectiles;
    }

    /**
     * This method allows to shoot the projectile.
     * @param {Living} livingSprite
     * @param {Number} velocity
     */
    shootProjectile(livingSprite, velocity){
        let projectile = this.getProjectiles().getFirstDead();

        if(projectile){
            this.play(this.getShootingAnimation().getAnimationName());

            this.playSoundEffect();
            
            projectile.shoot(livingSprite, velocity);

        }
    }

    /**
     * Gets the shooting animation object of the weapon.
     * @returns 
     */
    getShootingAnimation(){
        return this.weaponShootingAnimation;
    }

    /**
     * Gets the bullet properties of the weapon's projectile.
     * @returns {Object}
     */
    getBulletProperties(){
        return this.bulletProperties;
    }

    /**
     * Gets the damage of the weapon's projectile.
     * @returns {Number}
     */
    getDamagePerBullet(){
        return this.bulletProperties.damage;
    }
    
    /**
     * Gets the critical damge of the weapon's projectile
     * @returns {Number}
     */
    getCriticalDamage(){
        return this.bulletProperties.critical;
    }

    /**
     * Gets the velocity of the weapon's projectile
     */
    getBulletVelocity(){
        return this.bulletProperties.velocity;
    }

    /**
     * Gets the minimum and maximum distance to deal damage concidering the distance to the object
     * of the weapon's projectile.
     * @returns {Object}
     */
    getDistanceLimits(){
        return this.distanceLimits;
    }

    /**
     * Gets the delay between shots of the weapon.
     * @returns {number}
     */
    getDelayBetweenShots(){
        return this.bulletProperties.delay;
    }   
}