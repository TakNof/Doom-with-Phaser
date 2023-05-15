/**
 * This class extends to Living class, due the "living" sprites could be
 * players or enemies. Furthermore, this class implements all the movement controlers for the enemy/s.
 */

class Enemy extends Living{
    /**
    * The constructor of Enemy Class.
    * @constructor
    * @param {Scene} scene The current scene of the game to place the sprite.
    * @param {Object} enemyOriginInfo  A list with the initial positioning information for the sprite.
    * @param {string} enemyImgStr An str of the image name given in the preload method of the main class.
    * @param {number} size The size of the sprite in pixels.
    * @param {number} depth The depth of rendering of the sprite.
    * @param {number} defaultVelocity The default velocity for the living sprite.
    */
    constructor(scene, enemyOriginInfo, enemyImgStr, size, depth, defaultVelocity, chaseDistance, allowChase){
        super(scene, enemyOriginInfo, enemyImgStr, size, depth, defaultVelocity/2);

        this.setRotation = this.originInfo.ang;
        this.setAngle = this.originInfo.ang;

        this.setXcomponent();
        this.setYcomponent();

        this.setProjectiles2D();
        this.setProjectiles3D();

        this.chaseDistance = chaseDistance;
        this.allowChase = allowChase;

        this.inSight = false;
    }

    /**
     * Sets the distance between the player and the enemy using the player's position.
     * @param {Object} player 
     */
    set setDistanceToPlayer(player){
        this.distanceToPlayer = this.hypoCalc(this.getPositionX, player.x, this.getPositionY, player.y);
    }

    /**
     * Gets the distance between the player and the enemy.
     * @return {number}
     */
    get getDistanceToPlayer(){
        return this.distanceToPlayer;
    }

    /**
     * Sets the sprite of the enemy which will be its representation in 3D camera.
     * @param {{width: Number, height: Number}} canvasSize 
     * @param {number} positionX 
     * @param {number} positionY 
     * @param {String} enemyImgStr 
     * @param {boolean} visible 
     */
    setEnemy3D(canvasSize, positionX, positionY, enemyImgStr, visible = false){
        this.sprite3D = new Sprite(this.scene, {x: positionX, y: positionY}, enemyImgStr, this.getSize, 3)
        this.sprite3D.setVisible = visible;
        this.setAttackSound(canvasSize);
        this.setDeathSound(canvasSize);
    }


    set setNewEnemy3D(newEnemy3D){
        this.sprite3D.sprite = newEnemy3D;
    }

    /**
     * Gets the sprite of the enemy which will be its representation in 3D camera.
     */
    get getEnemy3D(){
        return this.sprite3D;
    }

    /**
     * Sets the group of projectiles of the enemy.
     */
    setProjectiles2D(){
        this.enemyProjectiles = this.scene.physics.add.group();
    }

    /**
     * Gets the enemy projectiles.
     */
    get getProjectiles2D(){
        return this.enemyProjectiles;
    }

    /**
     * Sets the projectile 3D of the enemy.
     */
    setProjectiles3D(){
        this.enemyProjectiles3D = this.scene.physics.add.group();
    }

    /**
     * Gets the projectile 3D of the enemy.
     * @returns {Projectile}
     */
    get getProjectiles3D(){
        return this.enemyProjectiles3D;
    }

    /**
     * Sets the projectile properties of the enemy.
     * @param {{damage: Number, velocity: Number, delay: Number, critical: Number}} bulletProperties
     */
    set setBulletProperties(bulletProperties){
        this.bulletProperties = bulletProperties;
    }

    /**
     * Gets the projectile properties of the enemy.
     * @return {{damage: Number, velocity: Number, delay: Number, critical: Number}}
     */
    get getBulletProperties(){
        return this.bulletProperties;
    }

    /**
     * Sets the projectile effective distances of the enemy.
     * @param {{min: Number, max: Number}} distanceLimits
     */
    set setDistanceLimits(distanceLimits){
        this.distanceLimits = distanceLimits;
    }

    /**
     * Gets the projectile effective distances of the enemy.
     * @return {{min: Number, max: Number}}
     */
    get getDistanceLimits(){
        return this.distanceLimits;
    }

    /**
     * Checks if the living sprite have been impacted by a projectile or not.
     * @param {Living} shooter The living object which has shot THIS living object.
     */
    evalProjectileCollision(shooter){
        let thisObject = this;

        this.scene.physics.collide(this.getSprite, shooter.getPlayerCurrentWeapon.getProjectiles,
            function(sprite, projectile){
                thisObject.__checkDamage(
                    projectile,
                    shooter.getPlayerCurrentWeapon.getBulletProperties,
                    shooter.getPlayerCurrentWeapon.getDistanceLimits,
                    thisObject.getDistanceToPlayer
                );
            }
        );
    }

    /**
     * This method is called when a projectile has collided with a living sprite,
     * here he health and the state of the living sprite is determined by the
     * damage and limit distances of the projected projectiles.
     * @param {Projectile} projectile 
     * @param {Number} damage 
     * @param {Object} distanceLimits 
     * @param {Number} currentDistance 
     * @returns 
     */
    __checkDamage(projectile, bulletProperties, distanceLimits, currentDistance){
        projectile.destroy();
        let damage = bulletProperties.damage;
        let critical = false;

        if(currentDistance > distanceLimits.min && currentDistance < distanceLimits.max){
            damage *= 220/currentDistance;
            console.log(`${this} Normal damage ${damage}`);
        }else if(currentDistance >= distanceLimits.max){
            damage *= 1/distanceLimits.max;
            console.log(`${this} Minimal damage ${damage}`);
        }else if(currentDistance <= distanceLimits.min){
            damage *= bulletProperties.critical * 220/currentDistance;
            console.log(`${this} Critical damage ${damage}`);
            critical = true;
        }

        if(this.getHealth - damage <= 0){
            this.setHealth = 0;
            this.setAbleToShoot = false;

            this.playDeathSound();

            if(critical){
                player.heal(bulletProperties.damage*0.04);
            }else{
                player.heal(damage*0.08);
            }
        }else{
            this.setHealth = this.getHealth - damage;
        }
    }

    waitToDestroy(){
        if(this.getProjectiles2D.getChildren().length != 0){
            this.setVisible = false;
            this.getEnemy3D.setVisible = false;
            this.getSprite.body.enable = false;
            
        }else{
            this.getEnemy3D.getSprite.destroy();
            this.getSprite.destroy();
            this.setIsAlive = false;
        }
    }

    /**
     * Sets the attack sound of the enemy.
     * @param {{width: Number, height: Number}} canvasSize 
     */
    setAttackSound(canvasSize){
        this.attackSound = new Sound(this.scene, canvasSize, this.getEnemy3D.getSpriteImgStr + "_attack_sound");
    }
    
    /**
     * Gets the attack sound of the enemy.
     * @returns {Sound}
     */
    getAttackSound(){
        return this.attackSound;
    }

    /**
     * Plays the sound effect of the enemy.
     */
    playAttackSound(){
        this.getAttackSound().playSound();
    }

    /**
     * Sets the death sound of the player.
     * @param {{width: Number, height: Number}} canvasSize 
     */
    setDeathSound(canvasSize){
        this.deathSound = new Sound(this.scene, canvasSize, "cacodemon_death_sound");
    }
    
    /**
     * Gets the death sound of the player.
     * @returns {Sound}
     */
    getDeathSound(){
        return this.deathSound;
    }

    /**
     * Plays the death sound of the player.
     */
    playDeathSound(){
        this.getDeathSound().playSound();
    }

    /**
     * Sets the panning effect to the attack sound effect of the enemy.
     * @param {Number} canvasWidth
     * @param {Number} playerAngle
     */
    setgetAttackPanning(canvasWidth, playerAngle){
        let anglePlayerToEnemy = this.adjustAngleValue(this.getAngleToElement + Math.PI);

        let angleAdjustedFromPlayer = this.adjustAngleValue(anglePlayerToEnemy - playerAngle);
        
        let x = Math.cos(angleAdjustedFromPlayer) * this.getDistanceToPlayer;

        if(x == 0){
            x = canvasWidth/2;
        }else{
            x += canvasWidth/2;
        }

        this.attackSound.setPan(Phaser.Math.Linear(-1, 1, x / canvasWidth));
    }

    /**
     * This method stablishes the angle of the enemy respect to the element.
     * @param {number} elementPosition1 The position of the element1.
     * @param {number} elementPosition2 The position of the element2.
     * @returns {number} 
     */
    angleToElement2(elementPosition1, elementPosition2){
        if(elementPosition1.x > elementPosition2.x){
            return Math.atan((elementPosition1.y - elementPosition2.y)/(elementPosition1.x - elementPosition2.x)) + Math.PI;
        }else{
            return Math.atan((elementPosition1.y - elementPosition2.y)/(elementPosition1.x - elementPosition2.x))
        }
    }

    /**
     * This method allows the enemy to have the basic controls of movement according to the stablished parameters.
     */
    move(playerPosition){
        this.setVelocity = 0;
        this.setRayData();

        if(this.getDebug === true){
            this.spriteRays.setVelocity = 0;
            this.spriteRays.redrawRay2D(this.getPosition, this.getRayData);
        }   

        this.raycaster.setSpritePosition = this.getPosition;

        this.setAngleToElement = playerPosition;
        this.getRaycaster.setRayAngle = this.getAngleToElement;
        this.setDistanceToPlayer = playerPosition;

        //We want the enemy to follow us if we are in range of sight and if the distance with the player is less than the distance
        //with the wall.
        if (this.allowChase && this.getDistanceToPlayer <= this.chaseDistance &&  this.getDistanceToPlayer > 200 && (this.getDistanceToPlayer <this.getRayData.distance[0] || this.getRayData.distance[0] == undefined)) {           
            this.setXcomponent();
            this.setYcomponent();

            this.setVelocityX = this.getXcomponent;
            this.setVelocityY = this.getYcomponent;

            //We want the enemy to react when we are 

            if(this.getDebug === true){
                for(let ray of this.spriteRays.rays){
                    ray.body.setVelocityX(this.getVelocityX);
                    ray.body.setVelocityY(this.getVelocityY);
                }
            }
        }

        if(this.getDistanceToPlayer <= this.chaseDistance && this.getDistanceToPlayer <this.getRayData.distance[0] || this.getRayData.distance[0] == undefined){
            this.inSight = true;
        }else{
            this.inSight = false;
        }
        
        this.setAngle = this.getAngleToElement + this.angleOffset
        this.setRotation = this.getAngle;
    }

    shoot(properties, randNumber, player, canvasSize){
        this.getAttackSound().setSoundPanning(this.getDistanceToPlayer, this.angleToElement + Math.PI, player.getAngle);
        if(this.inSight && this.getAbleToShoot){
            let time = this.scene.time.now;
            if (time - this.lastShotTimer > properties.delay + randNumber*100) {
                let projectile = new Projectile(this.scene, this.getPosition, "small_energy_bomb", 32, 80, 100);
                this.getProjectiles2D.add(projectile.getSprite);

                projectile.setProjectile3D(canvasSize.width/2, canvasSize.width/2, "energy_bomb");            
                this.getProjectiles3D.add(projectile.getProjectile3D.getSprite);

                projectile.shootProjectile(this);
                this.playAttackSound();
                
                this.lastShotTimer = time;
            }
        }
    }
}