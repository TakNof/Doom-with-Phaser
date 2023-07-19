class Weapon extends Sprite{
    /**
    * The constructor of Weapons Class.
    * @constructor
    * @param {Scene} scene The scene of the game to place bullets.
    * @param {Scene} scene3D The current scene of the game to place the weapon sprite.
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
    constructor(scene, originInfo, spriteImgStr, size, depth, bulletProperties, distanceLimits, animationParams){
        super(scene, originInfo, spriteImgStr, size, depth);

        this.bulletProperties = bulletProperties;
        this.distanceLimits = distanceLimits;

        this.weaponShootingAnimation = new SpriteAnimation(this.getScene, this.getSpriteImgStr);
        this.switchWeaponDelay = 1000;
        this.setSoundEffect();
        
        this.getShootingAnimation().setAnimationFrames(animationParams.end, animationParams.framerate, animationParams.repeat);

        this.switchWeaponSounds = Array(3);

        for(let i = 0; i < 3; i++){
            this.switchWeaponSounds[i] = new Sound(this.getScene, `switch_weapon_sound_${i + 1}`);
        } 
    }

    /**
     * Sets the sound effect of the weapon.
     */
    setSoundEffect(){
        this.soundEffectName = this.getScene.sound.add(this.getSpriteImgStr + "_sound");
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
        let key = "bullet";
        this.weaponProjectiles = Scene2D.physics.add.group({
			classType: Projectile,
            maxSize: 20
		});

        this.weaponProjectiles.createMultiple({
            key: key,
            quantity: 10,
            active: false,
            visible: false
        });

        Phaser.Actions.SetXY(this.weaponProjectiles.getChildren(), -32, -32);
    }

    /**
     * Gets the weapon's projectiles.
     * @returns {Projectile}
     */
    get getProjectiles(){
        return this.weaponProjectiles;
    }

    /**
     * This method allows to shoot the projectile.
     * @param {Living} livingSprite
     * @param {Number} velocity
     */
    shootProjectile(livingSprite, velocity){
        let projectile = this.getProjectiles.getFirstDead();

        if(projectile){
            this.getSprite.play(this.getShootingAnimation().getAnimationName);

            this.playSoundEffect();

            livingSprite.addRoundShot();
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