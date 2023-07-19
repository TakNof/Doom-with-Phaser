/**
 * This class extends to Living class, due the "living" sprites could be
 * players or enemies. Furthermore, this class implements all the movement controlers for the enemy/s.
 */

class Enemy extends Living{
    /**
    * The constructor of Enemy Class.
    * @constructor
    * @param {Scene} scene The scene to place the 2D sprites in the game.
    * @param {Scene} scene3D The scene to place the 3D sprites in the game.
    * @param {Object} enemyOriginInfo  A list with the initial positioning information for the sprite.
    * @param {string} enemyImgStr An str of the image name given in the preload method of the main class.
    * @param {number} size The size of the sprite in pixels.
    * @param {number} depth The depth of rendering of the sprite.
    * @param {number} defaultVelocity The default velocity for the living sprite.
    */
    constructor(scene, scene3D, enemyOriginInfo, enemyImgStr, size, depth, defaultVelocity, chaseDistance, allowChase){
        super(scene, enemyOriginInfo, enemyImgStr, size, depth, defaultVelocity);

        this.sprite.scene3D = scene3D;

        this.setEnemy3D(canvasSize.width/2, canvasSize.height/2, "cacodemon");

        this.setXcomponent();
        this.setYcomponent();

        this.setProjectiles3D();

        this.chaseDistance = chaseDistance;
        this.allowChase = allowChase;

        this.inSight = false;

        this.creationTime = this.getScene.time.now;
        
        let animationsToSet = [
            {
                name: "attack",
                animationParams:{
                    end: 9,
                    framerate: 15,
                }
            },
            {
                name: "hurt",
                animationParams:{
                    end: 7,
                    framerate: 15
                }
            }
        ];   

        this.setAnimations(animationsToSet);

        this.setSpriteSounds("cacodemon", ["hurt", "death", "attack"]);
    }

    /**
     * Sets the chase distance of the enemy
     * @param {Number} chaseDistance
     */
    set chaseDistance(chaseDistance){
        this.sprite.chaseDistance = chaseDistance;
    }

    /**
     * Gets the chase distance of the enemy.
     * @return {Number} chaseDistance
     */
    get chaseDistance(){
        return this.sprite.chaseDistance
    }

    /**
     * Sets the boolean to allow the enemy to chase the player.
     * @param {Boolean} allowChase
     */
    set allowChase(allowChase){
        this.sprite.allowChase = allowChase;
    }

    /**
     * Gets the boolean to allow the enemy to chase the player.
     * @return {Boolean} allowChase
     */
    get allowChase(){
        return this.sprite.allowChase
    }

    /**
     * Sets the boolean to let the enemy know whether is in sight or not.
     * @param {Boolean} inSight
     */
    set inSight(inSight){
        this.sprite.inSight = inSight;
    }

    /**
     * Gets the boolean to let the enemy know whether is in sight or not.
     * @return {Boolean} inSight
     */
    get inSight(){
        return this.sprite.inSight
    }

    /**
     * Sets the creation time of the enemy.
     * @param {Time} creationTime
     */
    set creationTime(creationTime){
        this.sprite.creationTime = creationTime;
    }

    /**
     * Gets the creation time of the enemy.
     * @return {Time} creationTime
     */
    get creationTime(){
        return this.sprite.creationTime
    }


    /**
     * Sets the distance between the player and the enemy using the player's position.
     * @param {Object} player 
     */
    set setDistanceToPlayer(player){
        this.sprite.distanceToPlayer = this.hypoCalc(this.getPositionX, player.x, this.getPositionY, player.y);
    }

    /**
     * Gets the distance between the player and the enemy.
     * @return {number}
     */
    get getDistanceToPlayer(){
        return this.sprite.distanceToPlayer;
    }

    /**
     * Sets the sprite of the enemy which will be its representation in 3D camera.
     * @param {number} positionX 
     * @param {number} positionY 
     * @param {String} enemyImgStr 
     * @param {boolean} visible 
     */
    setEnemy3D(positionX, positionY, enemyImgStr, visible = false){
        this.sprite.sprite3D = new Sprite(this.getScene3D, {x: positionX, y: positionY}, enemyImgStr, this.getSize, 3)
        this.sprite.sprite3D.setVisible = visible;
    }


    set setNewEnemy3D(newEnemy3D){
        this.sprite.sprite3D.sprite = newEnemy3D;
    }

    /**
     * Gets the sprite of the enemy which will be its representation in 3D camera.
     */
    get getEnemy3D(){
        return this.sprite.sprite3D;
    }

    /**
     * Sets the group of projectiles of the enemy.
     */
    setProjectiles2D(){
        let key = "small_energy_bomb";
        this.sprite.enemyProjectiles = this.getScene.physics.add.group({
			classType: Projectile
		});

        this.sprite.enemyProjectiles.createMultiple({
            key: key,
            quantity: 5,
            active: false,
            visible: false
        });

        Phaser.Actions.SetXY(this.sprite.enemyProjectiles.getChildren(), -100, -100);
    }

    /**
     * Gets the enemy projectiles.
     */
    get getProjectiles2D(){
        return this.sprite.enemyProjectiles;
    }

    /**
     * Sets the projectile 3D of the enemy.
     */
    setProjectiles3D(){
        this.sprite.enemyProjectiles3D = this.getScene.physics.add.group();
    }

    /**
     * Gets the projectile 3D of the enemy.
     * @returns {Projectile}
     */
    get getProjectiles3D(){
        return this.sprite.enemyProjectiles3D;
    }

    /**
     * Sets the projectile properties of the enemy.
     * @param {{damage: Number, velocity: Number, delay: Number, critical: Number}} bulletProperties
     */
    set setBulletProperties(bulletProperties){
        this.sprite.bulletProperties = bulletProperties;
    }

    /**
     * Gets the projectile properties of the enemy.
     * @return {{damage: Number, velocity: Number, delay: Number, critical: Number}}
     */
    get getBulletProperties(){
        return this.sprite.bulletProperties;
    }

    /**
     * Sets the projectile effective distances of the enemy.
     * @param {{min: Number, max: Number}} distanceLimits
     */
    set setDistanceLimits(distanceLimits){
        this.sprite.distanceLimits = distanceLimits;
    }

    /**
     * Gets the projectile effective distances of the enemy.
     * @return {{min: Number, max: Number}}
     */
    get getDistanceLimits(){
        return this.sprite.distanceLimits;
    }

    /**
     * Checks if the living sprite have been impacted by a projectile or not.
     * @param {Living} shooter The living object which has shot THIS living object.
     */
    evalProjectileCollision(shooter){
        let thisObject = this;

        this.getScene.physics.collide(this.getSprite, shooter.getPlayerCurrentWeapon.getProjectiles,
            function(sprite, projectile){
                thisObject.__checkDamage(
                    shooter,
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
     * @param {Living} shooter
     * @param {Projectile} projectile 
     * @param {Number} damage 
     * @param {Object} distanceLimits 
     * @param {Number} currentDistance 
     */
    __checkDamage(shooter, projectile, bulletProperties, distanceLimits, currentDistance){
        projectile.body.reset(-100, -100); 

        projectile.setActive(false);
        projectile.setVisible(false);

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

        shooter.addDamageDealed(damage);

        if(this.getHealth - damage <= 0){
            this.setHealth = 0;
            this.setAbleToShoot = false;

            this.getSpriteSounds("death").playSound();

            if(critical){
                shooter.heal(bulletProperties.damage*0.08);
            }else{
                shooter.heal(damage*0.08);
            }

        }else{
            this.setHealth = this.getHealth - damage;
            this.getSpriteSounds("hurt").playSound();
            this.getEnemy3D.getSprite.play(this.getAnimations("hurt").getAnimationName);
        }
    }

    waitToDestroy(){
        if(this.getProjectiles2D.getChildren().length != 5){
            this.setVisible = false;
            this.getEnemy3D.setVisible = false;
            this.getSprite.body.enable = false;
            
        }else{
            this.getEnemy3D.getSprite.destroy();
            this.isAlive = false;
            this.getSprite.destroy();
        }
    }

    /**
     * Sets the animations of the enemy.
     * @param {Array<String>} animationsArray 
     */
    setAnimations(animationsArray){
        this.sprite.animations = {};

        for(let animation of animationsArray){
            this.sprite.animations[animation.name] = new SpriteAnimation(this.getScene3D, `${this.getEnemy3D.getSpriteImgStr}_${animation.name}`);
            this.sprite.animations[animation.name].setAnimationFrames(animation.animationParams.end, animation.animationParams.framerate, animation.animationParams.repeat);
        }

    }

    getAnimations(element){
        return this.sprite.animations[element];
    }

    /**
     * This method allows the enemy to have the basic controls of movement according to the stablished parameters.
     */
    move(playerPosition){
        this.setVelocity = 0;
        this.setRayData();

        if(this.getDebug === true){
            this.getSpriteRays.setVelocity = 0;
            this.getSpriteRays.redrawRay2D(this.getPosition, this.getRayData);
        }   

        this.getRaycaster.setSpritePosition = this.getPosition;

        this.setRotation = this.angleToElement(playerPosition);

        this.getRaycaster.setRayAngle = this.adjustAngleValue(this.angleToElement(playerPosition));
        this.setDistanceToPlayer = playerPosition;

        //We want the enemy to follow us if we are in range of sight and if the distance with the player is less than the distance
        //with the wall.
        if (this.allowChase && this.getDistanceToPlayer <= this.chaseDistance &&  this.getDistanceToPlayer > 200 && (this.getDistanceToPlayer <this.getRayData.distance[0] || this.getRayData.distance[0] == undefined)) {           
            this.setXcomponent();
            this.setYcomponent();

            this.setVelocityX = this.getXcomponent;
            this.setVelocityY = this.getYcomponent;

            if(this.getDebug === true){
                for(let ray of this.getSpriteRays.rays){
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
        
        this.setAngle = this.angleToElement(playerPosition) - this.getOriginInfo.angleOffset;
        this.setRotation = this.getAngle;
    }

    shoot(properties, randNumber, player){
        let projectile = this.getProjectiles2D.getFirstDead();

        if(this.inSight && this.getAbleToShoot && projectile){
            this.getSpriteSounds("attack").setSoundPanning(this.getDistanceToPlayer, this.angleToElement + Math.PI, player.getAngle);
            let time = this.getScene.time.now - this.creationTime;

            if(time - this.lastShotTimer > properties.delay + randNumber*100){
                this.getEnemy3D.getSprite.play(this.getAnimations("attack").getAnimationName);
                this.lastShotTimer = time;
                setTimeout(() =>{
                    projectile.shoot(this, properties.velocity)

                    this.getSpriteSounds("attack").playSound();
                }, 300)
            }
        }
    }
}