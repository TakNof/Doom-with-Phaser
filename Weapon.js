class Weapon extends Sprite{
    /**
    * The constructor of Weapons Class.
    * @constructor
    * @param {Scene} scene The current scene of the game to place the weapon sprite.
    * @param {number[]} originInfo  A list with the initial positioning information for the weapon sprite.
    * @param {string} weapon spriteImgStr An str of the image name given in the preload method of the main class.
    * @param {number}size The size of the weapon sprite in pixels.
    * @param {number} depth The depth of rendering of the weapon sprite.
    * @param {{number, number, number}} bulletProperties 
    * The damage per bullet, the projectile velocity and the delay in seconds between the shots for the weapon sprite. 
    * @param {{number, number}} distanceLimits The minimum and maximum distance to deal damage concidering the distance to the object.
    * @param {number[]} delayBetweenBullets The delay in seconds between the shots the weapon sprite.
    *  
    */
    constructor(scene, originInfo, spriteImgStr, size, depth, {damage, velocity, delay, critical}, {min, max}){
        super(scene, originInfo, spriteImgStr, size, depth);

        this.bulletProperties = {damage: damage, velocity: velocity, delay: delay*1000, critical: critical};
        this.distanceLimits = {min: min, max: max};

        this.setAnimationName();
        this.setSoundEffect();
        this.setProjectiles();
    }
    
    /**
     * Sets the sound effect of the weapon.
     */
    setSoundEffect(){
        this.soundEffectName = this.scene.sound.add(this.getSpriteImgStr + "_sound");
    }

    /**
     * Plays the sound effect of the weapon.
     */
    playSoundEffect(){
        this.soundEffectName.play();
    }

    /**
     * Sets the group of projectiles of the weapon.
     */
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

    /**
     * Gets the bullet properties of the weapon's projectile.
     * @returns {Object}
     */
    get getBulletProperties(){
        return this.bulletProperties;
    }

    /**
     * Gets the damage of the weapon's projectile.
     * @returns {Number}
     */
    get getDamagePerBullet(){
        return this.bulletProperties.damage;
    }
    
    /**
     * Gets the critical damge of the weapon's projectile
     * @returns {Number}
     */
    get getCriticalDamage(){
        return this.bulletProperties.critical;
    }

    /**
     * Gets the velocity of the weapon's projectile
     */
    get getBulletVelocity(){
        return this.bulletProperties.velocity;
    }

    /**
     * Gets the minimum and maximum distance to deal damage concidering the distance to the object
     * of the weapon's projectile.
     * @returns {Object}
     */
    get getDistanceLimits(){
        return this.distanceLimits;
    }

    /**
     * Gets the delay between shots of the weapon.
     * @returns {number}
     */
    get getDelayBetweenShots(){
        return this.bulletProperties.delay;
    }   
}